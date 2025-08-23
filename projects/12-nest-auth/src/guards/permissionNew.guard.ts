import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Permission } from 'src/user/entities/permission.entity';

@Injectable()
export class PermissionNewGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(Reflector)
  private reflector: Reflector;

  canActivate(context: ExecutionContext): boolean {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }
    const token = bearer[1];
    const info: {
      user: { id: number; username: string; permissions: Permission[] };
    } = this.jwtService.verify(token);
    const user = info.user; // 这里就能拿到 id 和 username

    console.log('user from token: ', user);
    const permission: string = this.reflector.get(
      'permission',
      context.getHandler(),
    );

    if (user.permissions?.some((item) => item.name === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
