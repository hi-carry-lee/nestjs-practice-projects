import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Request, Response, NextFunction } from 'express';
// import { GlobalOneGuard } from './global-one.guard';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(function (req: Request, res: Response, next: NextFunction) {
    console.log('全局中间件 - before', req.url);
    // 当响应写完 (finish) 或连接被意外断开 (close) 才执行
    const done = () => {
      console.log('全局中间件 - 真正的after');
    };
    res.once('finish', done);
    res.once('close', done);
    next();
    console.log('全局中间件 - after');
  });
  // app.useGlobalGuards(new GlobalOneGuard());

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
