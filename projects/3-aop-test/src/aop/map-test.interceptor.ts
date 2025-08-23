import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

// 用来演示RxJS的 map 和Interceptor
// map：对响应数据做修改，一般都是改成 {code, data, message} 的格式
@Injectable()
export class MapTestInterceptor implements NestInterceptor {
  // 使用泛型类解决any问题：因为这是一个通用逻辑，本来就无法提前确定类型
  intercept<T>(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<{ code: number; message: string; data: T }> {
    return next.handle().pipe(
      map((data: T) => {
        return { code: 200, message: 'success', data };
      }),
    );
  }

  // 原始代码会有类型问题：data是any类型
  // intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
  //   return next.handle().pipe(
  //     map((data) => {
  //       return { code: 200, message: 'success', data };
  //     }),
  //   );
  // }
}
