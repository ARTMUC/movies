import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import { MovieResponseDto } from './dto/movie-response.dto';

@Injectable()
export class FilmApiService {
  constructor(private readonly configService: ConfigService) {}

  public async fetchMovie(title: string): Promise<MovieResponseDto> {
    const apiKey = this.configService.get('MOVIES_API_KEY');
    const res = await fetch(
      `http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`,
    );
    if (!res.ok) {
      throw new HttpException('Movie not found.', 404);
    }
    const { Title, Released, Genre, Director } = await res.json();
    return {
      title: Title,
      released: Released,
      genre: Genre,
      director: Director,
    };
  }
}
