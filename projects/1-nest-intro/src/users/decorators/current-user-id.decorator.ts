import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthRequest } from '../auth.request';

// export const CurrentUserId = createParamDecorator(
//   (data: unknown, ctx: ExecutionContext) => {
//     const request = ctx.switchToHttp().getRequest();
//     return request.user?.sub;
//   },
// );

// fix the type issue: Unsafe assignment of an `any` value.eslint@typescript-eslint/no-unsafe-assignment (parameter) ctx: ExecutionContext
// 以及：Unsafe return of a value of type `any`.eslint@typescript-eslint/no-unsafe-return
/*
1. getRequest()默认返回any类型，而any类型是不安全的，所以需要显式指定类型
2. 就算指定了Request类型，const request = ctx.switchToHttp().getRequest<Request>();没有报错了，但是 request.user?.sub; 提示：Property 'sub' does not exist on type 'Request'.
3. 所以需要单独定义一个AuthRequest类型，并继承Request类型，为它添加user属性，类型为JwtPayload
*/

export const CurrentUserId = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    // 提供更明确的返回类型
    const request = ctx.switchToHttp().getRequest<AuthRequest>();
    return request.user?.sub;
  },
);
