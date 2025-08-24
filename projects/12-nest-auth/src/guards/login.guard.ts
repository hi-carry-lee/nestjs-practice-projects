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

// 扩展Express的Request类型的两种方法，添加user属性
// declare module 'express' {
//   interface Request {
//     user?: {
//       userId: number;
//       username: string;
//     };
//   }
// }

// interface AuthRequest extends Request {
//   user?: {
//     userId: number;
//     username: string;
//   };
// }

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
      // 来自Express的类型，没有user属性，为什么这里不报错？原因未知
      request.user = info.user;
      // !这里没有报错，实际上是应该扩展一个Request类型，然后添加一个user属性
      // !如果是 request['user'] = info.user; 也不会报错，因为TS对动态属性是比较宽松的，
      // !但是不建议这样写，因为绕过了TS的类型检查，可能会导致一些问题

      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('登录 token 失效，请重新登录');
    }
  }
}
