import { Injectable } from '@nestjs/common';
import { RedisService } from './redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  getHello(): string {
    return 'Hello World!';
  }

  updateCache(): string {
    return 'cache update';
  }

  // 使用 Redis 缓存
  async getHelloWithCache(): Promise<string> {
    // 尝试从缓存获取
    const cachedValue = await this.redisService.get('hello-key');
    if (cachedValue) {
      return `Cached: ${cachedValue}`;
    }

    // 模拟从数据库获取数据
    const data = 'Hello from database!';

    // 缓存数据，设置1小时过期
    await this.redisService.set('hello-key', data, 3600);

    return `Fresh: ${data}`;
  }

  // 设置缓存
  async setHello(message: string): Promise<void> {
    await this.redisService.set('hello-key', message, 3600);
  }
}
