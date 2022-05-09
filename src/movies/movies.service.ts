import { HttpException, Injectable } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { TokenPayload } from 'src/auth/interfaces/token-payload.interface';
import { CreateMovieDto } from './dto/create-movie.dto';
import { MovieResponseDto } from './dto/movie-response.dto';
import { FilmApiService } from './film-api.service';

@Injectable()
export class MoviesService {
  constructor(
    private readonly repository: PrismaService,
    private readonly filmApiService: FilmApiService,
  ) {}

  public async create(createMovieDto: CreateMovieDto, user: TokenPayload) {
    const { userId } = user;
    const { title } = createMovieDto;

    await this.verifyUserLimit(user);

    await this.upsertApplier(userId);

    const fetchedMovie = await this.filmApiService.fetchMovie(title);

    const movieInDB = await this.findMovieByTitle(fetchedMovie.title);

    if (!movieInDB) {
      const newMovie = await this.createMovie(userId, fetchedMovie);
      return newMovie;
    }

    this.checkIfMovieOnApplierList(movieInDB, userId);

    const updatedMovie = await this.updateMovieWithUser(userId, movieInDB);
    return updatedMovie;
  }

  public async findAll(user: TokenPayload) {
    const { userId } = user;

    const movies = await this.repository.movies.findMany({
      where: { appliers: { some: { appliersUserId: userId } } },
    });

    if (movies.length < 1) {
      throw new HttpException('No movies on the list', 404);
    }

    return movies;
  }

  private async verifyUserLimit(user: TokenPayload) {
    const { role, userId } = user;

    switch (role) {
      case 'premium':
        return;
      case 'basic':
        const allowedDocsCurrMonth = 5;
        const documentsCountCurrMonth = await this.countPostedDocsCurrMonth(
          userId,
        );
        if (allowedDocsCurrMonth <= documentsCountCurrMonth) {
          throw new HttpException('Monthly limit reached', 400);
        }
        return;

      default:
        throw new HttpException('No customer plan acquired', 400);
    }
  }

  private countPostedDocsCurrMonth(userId: number) {
    const date = new Date();
    return this.repository.movies.count({
      where: {
        appliers: {
          some: {
            appliersUserId: userId,
            createdAt: {
              gte: new Date(date.getFullYear(), date.getMonth(), 1),
              lt: new Date(date.getFullYear(), date.getMonth() + 1, 0),
            },
          },
        },
      },
    });
  }

  private async upsertApplier(userId: number) {
    const applier = await this.repository.appliers.findUnique({
      where: { userId },
    });

    if (!applier) {
      await this.repository.appliers.create({
        data: { userId },
      });
    }
  }

  private async createMovie(userId: number, movie: MovieResponseDto) {
    return await this.repository.movies.create({
      data: {
        ...movie,
        appliers: {
          create: { appliersUserId: userId, createdAt: new Date() },
        },
      },
    });
  }

  private async updateMovieWithUser(userId: number, movie: MovieResponseDto) {
    const updatedMovie = await this.repository.moviesOnAppliers.create({
      data: {
        movies: {
          connect: {
            id: movie.id,
          },
        },
        appliers: {
          connect: {
            userId,
          },
        },
      },
      include: {
        movies: true,
      },
    });
    return updatedMovie.movies;
  }

  private async findMovieByTitle(title: string) {
    return (
      await this.repository.movies.findMany({
        where: { title: { equals: title, mode: 'insensitive' } },
        include: { appliers: { select: { appliersUserId: true } } },
      })
    )[0];
  }

  private checkIfMovieOnApplierList(movieInDB, userId) {
    movieInDB?.appliers?.forEach((applier) => {
      if (applier.appliersUserId === userId) {
        throw new HttpException('The movie is already on the list', 400);
      }
    });
  }
}
