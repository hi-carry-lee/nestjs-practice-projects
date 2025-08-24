import { JwtService } from '@nestjs/jwt';
import { Injectable } from '@nestjs/common';

@Injectable()
export class GenerateToken {
  constructor(private readonly jwtService: JwtService) {}

  generateAccessToken(userId: number, username: string) {
    const access_token = this.jwtService.sign(
      { userId, username },
      { expiresIn: '30m' }, // it will override the default set in AppModule
    );
    const refresh_token = this.jwtService.sign(
      { userId, username },
      { expiresIn: '7d' },
    );
    return { access_token, refresh_token };
  }
}
