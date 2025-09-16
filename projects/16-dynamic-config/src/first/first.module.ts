import { Module } from '@nestjs/common';
import { FirstController } from './first.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  // 如果AppModule中没有设置global，这里要引入ConfigModule
  imports: [ConfigModule],
  controllers: [FirstController],
})
export class FirstModule {}
