import { Injectable } from '@nestjs/common';
import { TypedConfigService } from '../typed-config.service';
import { RedisOptions } from 'ioredis';

@Injectable()
export class RedisConfigService {
  constructor(private readonly configService: TypedConfigService) {}

  get redisConfig(): RedisOptions {
    return this.configService.get<RedisOptions>('redis')!;
  }
}
