import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { AuthService } from './auth/auth.service';

// 定义扩展的 Request 接口
export interface RequestWithUser extends Request {
  user: {
    email: string;
    firstName: string;
    lastName: string;
    picture: string;
    accessToken: string;
  };
}

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly authService: AuthService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('google')
  @UseGuards(AuthGuard('google'))
  async googleAuth() {}

  @Get('callback/google')
  @UseGuards(AuthGuard('google'))
  async googleAuthRedirect(@Req() req: RequestWithUser, @Res() res: Response) {
    try {
      const googleUser = req.user;

      // 查找或创建用户
      let user = await this.appService.findGoogleUserByEmail(googleUser.email);

      if (!user) {
        user = await this.appService.registerByGoogleInfo(googleUser);
      }

      // 生成JWT Token
      const tokens = await this.authService.generateTokens(user);

      // 设置HttpOnly Cookie (更安全)
      this.authService.setTokenCookies(res, tokens);

      // 重定向到前端应用
      const redirectUrl = this.authService.buildFrontendRedirectUrl(user);

      return res.redirect(redirectUrl);
    } catch (error) {
      // 错误处理和日志记录
      console.error('Google OAuth callback failed', error);
      return res.redirect(
        'http://127.0.0.1:5500/projects/17-passport-google/index.html?error=auth_failed',
      );
    }
  }
}
