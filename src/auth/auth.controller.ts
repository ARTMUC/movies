import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  HttpCode,
  Req,
} from '@nestjs/common';
import { ApiOkResponse } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { Request } from 'express';
import LoginDto from './dto/login.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOkResponse()
  @HttpCode(200)
  @Post('login')
  async login(@Body() loginDto: LoginDto, @Req() request: Request) {
    const jwtCookie = await this.authService.createToken(loginDto);
    request.res.setHeader('Set-Cookie', [jwtCookie]);
    return;
  }

  @ApiOkResponse()
  @HttpCode(200)
  @Post('logout')
  logout(@Req() request: Request) {
    request.res.setHeader('Set-Cookie', this.authService.getLogoutCookie());
    return 'you are logged out';
  }
}
