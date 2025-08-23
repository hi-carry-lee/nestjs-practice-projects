import { Module } from '@nestjs/common';
import { BbbService } from './bbb.service';
import { BbbController } from './bbb.controller';
import { RedisClientService } from 'src/redis-client.service';

@Module({
  controllers: [BbbController],
  providers: [BbbService, RedisClientService],
  exports: [BbbService],
})
export class BbbModule {}
