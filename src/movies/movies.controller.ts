import {
  Controller,
  Get,
  Post,
  Body,
  Req,
  UseGuards,
  HttpCode,
} from '@nestjs/common';
import { MoviesService } from './movies.service';
import RequestWithUser from 'src/auth/interfaces/request-with-user.interface';
import JwtAuthenticationGuard from 'src/auth/guards/jwt-auth.guard';
import { CreateMovieDto } from './dto/create-movie.dto';
import { ApiOkResponse } from '@nestjs/swagger';
import { MovieResponseDto } from './dto/movie-response.dto';

@UseGuards(JwtAuthenticationGuard)
@Controller('movies')
export class MoviesController {
  constructor(private readonly moviesService: MoviesService) {}

  @ApiOkResponse({ type: MovieResponseDto })
  @HttpCode(201)
  @Post()
  create(
    @Body() createMovieDto: CreateMovieDto,
    @Req() request: RequestWithUser,
  ) {
    const { user } = request;
    return this.moviesService.create(createMovieDto, user);
  }

  @ApiOkResponse({ type: [MovieResponseDto] })
  @HttpCode(200)
  @Get()
  findAll(@Req() request: RequestWithUser) {
    const { user } = request;
    return this.moviesService.findAll(user);
  }
}
