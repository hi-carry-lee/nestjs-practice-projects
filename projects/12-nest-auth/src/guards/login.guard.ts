import { JwtService } from '@nestjs/jwt';
import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { User } from '../user/entities/user.entity';

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // 为什么返回值可以用Express的Request作为类型？
    // 因为：NestJS 默认的 HTTP 适配器是 Express，默认情况下 getRequest() 返回的是 Express 的 Request 对象
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header('authorization') || '';

    const bearer = authorization.split(' ');

    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }

    const token = bearer[1];

    try {
      const info: { user: User } = this.jwtService.verify(token);
      // 来自Express的类型，没有user属性，为什么这里不报错？
      // 因为Express的user类型是 泛型接口
      request.user = info.user;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
