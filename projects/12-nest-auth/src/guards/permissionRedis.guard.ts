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
import { RedisClientService } from 'src/redis/redis-client.service';

@Injectable()
export class PermissionRedisGuard implements CanActivate {
  @Inject(RedisClientService)
  private redisService: RedisClientService;
  @Inject()
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

    const redisPermissions: string | null = await this.redisService.get(
      `${user.id}-permissions`,
    );

    const foundUser = await this.userService.findByUsername(user.username);
    if (!foundUser) {
      return false;
    }
    if (!redisPermissions) {
      const permissionStr = foundUser.permissions.map((p) => p.name).join(',');
      await this.redisService.set(`${user.id}-permissions`, permissionStr);
    }

    console.log('persmissions from redis: ', redisPermissions);
    const permission: string = this.reflector.get(
      'permission',
      context.getHandler(),
    );

    if (redisPermissions?.includes(permission)) {
      return true;
    } else {
      throw new UnauthorizedException('没有权限访问该接口');
    }
  }
}
