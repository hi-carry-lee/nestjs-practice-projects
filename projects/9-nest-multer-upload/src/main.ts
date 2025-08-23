import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { WINSTON_LOGGER_TOKEN } from './winston/winston.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: true,
    // logger: ['debug', 'error'],
  });
  // app.useLogger(new MyLogger());
  // 使用动态模块形式的日志
  app.useLogger(app.get(WINSTON_LOGGER_TOKEN));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
