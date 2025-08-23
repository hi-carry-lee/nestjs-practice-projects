import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.enableCors();
  // 是为了能访问 uploads 中的图片
  app.useStaticAssets(join(__dirname, '../uploads'), { prefix: '/uploads' });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
