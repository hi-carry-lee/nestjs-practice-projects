import * as dotenv from 'dotenv';
// 想要使用proces.env，必须提前加载
dotenv.config();

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000); // 改回 3000
}
bootstrap();
