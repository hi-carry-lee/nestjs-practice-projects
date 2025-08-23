import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
  RequestTimeoutException,
} from '@nestjs/common';
import {
  catchError,
  Observable,
  throwError,
  timeout,
  TimeoutError,
} from 'rxjs';

// timeout：处理响应超时的情况，抛出一个 TimeoutError，配合 catchErrror 可以返回超时的响应
@Injectable()
export class TimeoutInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      // timeout 操作符会在 3s 没收到消息的时候抛一个 TimeoutError。
      timeout(3000),
      // 用 catchError 操作符处理下，如果是 TimeoutError，就返回 RequestTimeoutException，这个有内置的 exception filter 会处理成对应的响应格式
      catchError((err) => {
        if (err instanceof TimeoutError) {
          console.log(err);
          return throwError(() => new RequestTimeoutException());
        }
        return throwError(() => new Error(String(err)));
      }),
    );
  }
}
