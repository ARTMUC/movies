import { Module } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { MoviesController } from './movies.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { FilmApiService } from './film-api.service';

@Module({
  imports: [PrismaModule],
  controllers: [MoviesController],
  providers: [MoviesService, FilmApiService],
})
export class MoviesModule {}
