import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { User } from '../user.entity';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async generateTokens(user: User) {
    const payload = {
      sub: user.id,
      email: user.email,
    };

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: 'hello',
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(payload, {
        secret: 'hello',
        expiresIn: '7d',
      }),
    ]);

    return { accessToken, refreshToken };
  }

  setTokenCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000, // 15分钟
    });

    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7天
    });
  }

  buildFrontendRedirectUrl(user: User): string {
    // 重定向到前端地址，因为前端使用的是live server，所以需要使用live server的地址
    const baseUrl =
      'http://127.0.0.1:5500/projects/17-passport-google/index.html';
    const params = new URLSearchParams({
      userId: user.id.toString(),
      email: user.email,
      firstName: user.nickName?.split('_')[0] || '',
      lastName: user.nickName?.split('_')[1] || '',
    });

    return `${baseUrl}?${params.toString()}`;
  }
}
