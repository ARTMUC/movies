import { HttpException, Injectable } from '@nestjs/common';
import fetch from 'node-fetch';
import LoginDto from './dto/login.dto';

@Injectable()
export class UsersAPIService {
  public async getUserToken(request: LoginDto): Promise<string> {
    const res = await fetch(`http://localhost:3000/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(request),
    });
    if (!res.ok) {
      throw new HttpException('incorect username or password', 401);
    }
    const data = await res.json();
    return data.token;
  }
}
