import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LogMiddleware } from './aop/log.middleware';
// import { APP_GUARD } from '@nestjs/core';
// import { GlobalTwoGuard } from './global-two.guard';
import { PipeTestModule } from './pipe-test/pipe-test.module';
import { RedisService } from './redis.service';

@Module({
  imports: [PipeTestModule],
  controllers: [AppController],
  providers: [
    AppService,
    RedisService,
    // {
    //   provide: APP_GUARD,
    //   useClass: GlobalTwoGuard,
    // },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogMiddleware).forRoutes('aaa', 'aaa/*path');
  }
}
