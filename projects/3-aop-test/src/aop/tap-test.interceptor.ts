import {
  CallHandler,
  ExecutionContext,
  Injectable,
  Logger,
  NestInterceptor,
} from '@nestjs/common';
import { Observable, tap } from 'rxjs';
import { AppService } from '../app.service';

// 用来演示RxJS的 tap 和Interceptor
// tap: 不修改响应数据，执行一些额外逻辑，比如记录日志、更新缓存等
@Injectable()
export class TapTestInterceptor implements NestInterceptor {
  constructor(private appService: AppService) {}

  private readonly logger = new Logger(TapTestInterceptor.name);

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap((data) => {
        // 模拟更新缓存的操作
        console.log(this.appService.updateCache());
        this.logger.log(`log something`, data);
      }),
    );
  }
}
