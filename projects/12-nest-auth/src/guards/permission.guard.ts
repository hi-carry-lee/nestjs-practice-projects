import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';

@Injectable()
export class PermissionGuard implements CanActivate {
  @Inject(UserService)
  private userService: UserService;
  @Inject(JwtService)
  private jwtService: JwtService;
  @Inject(Reflector)
  private reflector: Reflector;

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.header('authorization') || '';
    const bearer = authorization.split(' ');
    if (!bearer || bearer.length < 2) {
      throw new UnauthorizedException('登录 token 错误');
    }
    const token = bearer[1];
    const info: { user: { id: number; username: string } } =
      this.jwtService.verify(token);
    const user = info.user; // 这里就能拿到 id 和 username

    const foundUser = await this.userService.findByUsername(user.username);

    console.log('PermissionGuard: ', foundUser);
    const permission: string = this.reflector.get(
      'permission',
      context.getHandler(),
    );

    if (foundUser?.permissions.some((item) => item.name === permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
