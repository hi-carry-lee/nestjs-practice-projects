import {
  CanActivate,
  ExecutionContext,
  Inject,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './role.js';
// 引入 Express 的 Request 类型
import { Request } from 'express';

// 定义用户接口
interface User {
  id: number;
  username: string;
  roles: Role[];
  email?: string;
}

// 扩展 Request 接口
interface RequestWithUserBody extends Request {
  body: User;
}
/*
测试说明
1. 前端使用postman发送请求，请求方式就是get，因为接口是@Get
2. 在body中添加json参数
3. 原始的Request请求没有body属性，所以需要自定义RequestWithUserBody类型
*/
@Injectable()
export class AaaGuard implements CanActivate {
  @Inject(Reflector)
  private readonly reflector: Reflector;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    // 这行代码：如果没有指定角色，则放行
    if (!roles) {
      return true;
    }
    const request = context.switchToHttp().getRequest<RequestWithUserBody>();
    const user = request.body;
    // 如果有角色的值，则需要是Handler上指定的值
    return roles.some((role) => user && user.roles?.includes(role));
  }
}
