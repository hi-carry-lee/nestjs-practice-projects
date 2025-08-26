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
import { IsPublic } from './is-public.decorator';
import { isGithubUser, isLocalUser } from './guards/type-guards';

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
  @IsPublic()
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
  @IsPublic()
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
  @IsPublic()
  loginToken(@Req() req: Request) {
    console.log(req.user);
    if (isLocalUser(req.user)) {
      const token = this.jwtService.sign({
        userId: req.user.userId,
        username: req.user.username,
      });
      return {
        user: req.user,
        token,
      };
    }
  }

  // 需要登录认证的接口
  @UseGuards(AuthGuard('jwt'))
  @Get('list')
  list(@Req() req: Request) {
    console.log(req.user);
    return ['111', '222', '333', '444', '555'];
  }

  @IsPublic()
  @Get('public')
  public() {
    return 'public api';
  }

  @Get('bbb')
  bbb() {
    return 'bbb';
  }

  @Get('github-login')
  @IsPublic() // 因为开启了全局守卫，这里需要加放行
  @UseGuards(AuthGuard('github'))
  async loginWithGithub() {}

  // 在 GithubStrategy 中，配置了 callbackURL: 'http://localhost:3000/callback'，所以这里会自动跳转到这个接口
  @Get('callback')
  @IsPublic() // 因为开启了全局守卫，这里需要加放行
  @UseGuards(AuthGuard('github')) // 两个接口都需要Guard
  authCallback(@Req() req: Request) {
    console.log('=== GitHub Callback Debug ===');
    console.log('req.user: ', req.user);
    console.log('req.user type: ', typeof req.user);
    console.log(
      'req.user keys: ',
      req.user ? Object.keys(req.user) : 'null/undefined',
    );

    if (isGithubUser(req.user)) {
      console.log('✅ 是 GitHub 用户，查找用户...');
      const user = this.userService.findUserByGithubId(req.user.id);
      console.log('找到的用户: ', user);
      return user;
    }

    console.log('❌ 不是 GitHub 用户');
    // 如果不是 GitHub 用户，返回错误信息
    return {
      error: 'Invalid user data',
      user: req.user,
    };
  }
}
