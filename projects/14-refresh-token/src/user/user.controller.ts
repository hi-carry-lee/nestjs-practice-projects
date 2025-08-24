import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from './user.service';
import { UserLoginDto } from './dto/user-login.dto';
import { JwtService } from '@nestjs/jwt';
import { GenerateToken } from './generateToken';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly generateToken: GenerateToken,
  ) {}

  @Post('login')
  async login(@Body() login: UserLoginDto) {
    console.log('login dto: ', login);
    const user = await this.userService.login(login);

    return this.generateToken.generateAccessToken(user.id, user.username);
  }

  @Get('refresh')
  async refresh(@Query('refresh_token') refreshToken: string) {
    try {
      const data: { userId: number } = this.jwtService.verify(refreshToken);

      const user = await this.userService.findUserById(data.userId);

      if (!user) {
        throw new UnauthorizedException('用户不存在');
      }

      return this.generateToken.generateAccessToken(user.id, user.username);
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('token 已失效，请重新登录');
    }
  }
}
