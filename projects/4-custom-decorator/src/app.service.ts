import { Inject, Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  @Inject(RedisService)
  private readonly redisService: RedisService;

  async getHello(): Promise<string> {
    // 用来测试redis是否正常
    const value = await this.redisService.get('hello-key');
    console.log('value get from redis is: ', value);
    return 'Hello World!';
  }

  async setHello(): Promise<void> {
    await this.redisService.set('hello-key', 'Hello World!');
  }
}
