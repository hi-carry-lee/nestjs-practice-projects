import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';

@Injectable()
export class TimeInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const startTime = Date.now();
    console.log('time interceptor start');
    return next.handle().pipe(
      tap(() => {
        console.log('time interceptor end: ', Date.now() - startTime);
      }),
    );
  }
}
