import { Injectable } from '@nestjs/common';

@Injectable()
export class RedisConfigService {
  get redisConfig() {
    return {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      lazyConnect: true,
      connectTimeout: 10000,
      keepAlive: 30000,
      family: 4,
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
      retryDelayOnClusterDown: 300,
      enableOfflineQueue: false,
      maxLoadingTimeout: 10000,
      enableReadyCheck: true,
    };
  }
}
