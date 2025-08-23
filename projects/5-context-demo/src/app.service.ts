import { Injectable } from '@nestjs/common';
import { RedisService } from './redis/redis.service';

@Injectable()
export class AppService {
  constructor(private readonly redisService: RedisService) {}

  getHello(): string {
    return 'Hello World!';
  }

  async test(): Promise<void> {
    const value = await this.redisService.get('hello-key');
    console.log('value get from redis is: ', value);
  }
}
