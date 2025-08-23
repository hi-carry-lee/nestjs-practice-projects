import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { Role } from './role.enum';
import { ROLES_KEY } from './decorators/roles.decorator';

interface JwtUser {
  sub: number;
  roles: Role[];
}

interface AuthRequest extends Request {
  user?: JwtUser;
}

// the new version fix the type issue;
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!requiredRoles) return true;

    const request = context.switchToHttp().getRequest<AuthRequest>(); // 类型安全
    const user = request.user;

    return requiredRoles.every((role) => user?.roles?.includes(role));
  }
}

// @Injectable()
// export class RolesGuard implements CanActivate {
//   constructor(private readonly reflector: Reflector) {}

//   canActivate(
//     context: ExecutionContext,
//   ): boolean | Promise<boolean> | Observable<boolean> {
//     const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
//       context.getHandler(),
//       context.getClass(),
//     ]);

//     if (!requiredRoles) return true;

//     const { user } = context.switchToHttp().getRequest();

//     return requiredRoles.every((role) => user?.roles?.includes(role));
//   }
// }
