import { Module, Global } from '@nestjs/common';
import { RedisService } from './redis.service';
import { RedisConfigService } from './redis-config.service';

@Global() // 全局模块，其他模块无需导入
@Module({
  providers: [RedisService, RedisConfigService],
  exports: [RedisService],
})
export class RedisModule {}
