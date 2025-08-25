import {
  Controller,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  Body,
  Get,
} from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { UserService } from './user/user.service';
import { JwtService } from '@nestjs/jwt';

interface JwtUserData {
  userId: number;
  username: string;
}

declare module 'express' {
  interface Request {
    user: JwtUserData;
  }
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  /*
  使用passport，则需要手动处理:
    1. 只需要创建 验证的策略，比如使用用户名和密码的策略：LocalStrategy
    2. 在login接口上，通过 @UseGuards(AuthGuard('local')) 来使用这个策略
    3. passport实现：
      1. 从请求体中提取 username 和 password 字段（passport会自动处理）
      2. 调用 LocalStrategy 的 validate 方法，传入 username 和 password
      3. 在 validate 方法中，验证成功，将user信息加入到req.user中
  */
  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Req() req: Request) {
    console.log(req.user);
    return req.user;
  }

  /*
  手动处理认证的版本，如果不使用passport，则需要手动处理:
    1. 从请求体中提取 username 和 password 字段
    2. 然后调用 UserService 的 validateUser 方法，验证用户名和密码
  */
  @Post('login-manual')
  loginManual(@Body() loginDto: { username: string; password: string }) {
    // 手动验证
    const user = this.userService.validateUser(
      loginDto.username,
      loginDto.password,
    );

    // 手动处理错误
    if (!user) {
      throw new UnauthorizedException('认证失败');
    }
    return user;
  }

  @UseGuards(AuthGuard('local'))
  @Post('login-token')
  loginToken(@Req() req: Request) {
    console.log(req.user);
    const token = this.jwtService.sign({
      userId: req.user.userId,
      username: req.user.username,
    });
    return {
      user: req.user,
      token,
    };
  }

  // 需要登录认证的接口
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  list(@Req() req: Request) {
    console.log(req.user);
    return ['111', '222', '333', '444', '555'];
  }
}
