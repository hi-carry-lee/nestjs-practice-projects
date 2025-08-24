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

@Injectable()
export class LoginGuard implements CanActivate {
  @Inject(JwtService)
  private jwtService: JwtService;

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request: Request = context.switchToHttp().getRequest();

    const authorization = request.headers.authorization;

    if (!authorization) {
      throw new UnauthorizedException('用户未登录');
    }

    console.log('authorization: ', authorization);

    try {
      const token = authorization.split(' ')[1];
      const data = this.jwtService.verify<{
        userId: number;
        username: string;
      }>(token);

      return true;
    } catch (e) {
      console.log(e);
      throw new UnauthorizedException('token 失效，请重新登录');
    }
  }
}
