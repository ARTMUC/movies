import { Controller, Get } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService, private readonly repository: PrismaService) {}

  @Get()
  async getHello() {
    await this.repository.movies.create({
      data: {
        title: 'asdfasdf',
        released: 'asdf',
        genre: 'asdf',
        director: 'asdfasdf',
      },
    });
    return this.appService.getHello();
  }

  @Get('/xxx')
  async getAll() {
    const movies = await this.repository.movies.findMany()
    return movies
  }

  @Get('/y')
  async check() {
    
    return 'movies'
  }
}
