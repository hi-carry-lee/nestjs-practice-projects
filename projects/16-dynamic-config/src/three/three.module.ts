import { Module } from '@nestjs/common';
import { ThreeController } from './three.controller';
import { configThree } from 'src/config/config-three';
import { ConfigModule } from '@nestjs/config';

@Module({
  // 如果AppModule中没有设置global，这里要引入ConfigModule
  // 这里演示只加载指定的配置文件
  controllers: [ThreeController],
  imports: [ConfigModule.forFeature(configThree)],
})
export class ThreeModule {}
