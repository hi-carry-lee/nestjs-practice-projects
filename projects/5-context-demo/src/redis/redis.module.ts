import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisConfigService } from './redis-config.service';
import { ConfigModule } from '@nestjs/config';

@Global() // 全局模块，其他模块无需导入
@Module({
  imports: [ConfigModule],
  providers: [RedisService, RedisConfigService],
  exports: [RedisService],
})
export class RedisModule {}
