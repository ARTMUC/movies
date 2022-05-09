import { HttpException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import fetch from 'node-fetch';
import LoginDto from './dto/login.dto';
import { TokenPayload } from './interfaces/token-payload.interface';
import { UsersAPIService } from './usersAPI.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersAPIService: UsersAPIService,
  ) {}

  public async createToken(loginDto: LoginDto) {
    const token = await this.usersAPIService.getUserToken(loginDto);
    const expiresIn = this.configService.get('JWT_EXPIRATION_TIME');
    return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${expiresIn}`;
  }

  public getLogoutCookie() {
    return 'Authentication=; HttpOnly; Path=/; Max-Age=0';
  }
}
