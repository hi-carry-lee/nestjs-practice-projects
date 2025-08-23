import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { Role } from 'src/user/entities/role.entity';
import { Reflector } from '@nestjs/core';

// !扩展 Express Request 接口，添加 user 属性
declare module 'express' {
  interface Request {
    user: { id: number; username: string; roles: Role[] };
  }
}

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requireLogin: boolean = this.reflector.getAllAndOverride<boolean>(
      'require-login',
      [context.getClass(), context.getHandler()],
    );

    if (!requireLogin) {
      return true;
    }

    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    try {
      const token = authorization.split(' ')[1];
      const data: {
        user: { id: number; username: string; roles: Role[] };
      } = this.jwtService.verify(token);
      request.user = data.user;
      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('token 失效，请重新登录!');
    }
  }
}
