import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';

// 定义最小的 Redis 客户端接口
interface SimpleRedisClient {
  get(key: string): Promise<string | null>;
  set(key: string, value: string): Promise<string>;
  setex(key: string, seconds: number, value: string): Promise<string>;
}

@Injectable()
export class RedisClientService implements OnModuleInit {
  private readonly logger = new Logger(RedisClientService.name);
  private client: SimpleRedisClient | null = null;
  private available = false;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    try {
      this.client = this.redisService.getOrNil() as SimpleRedisClient | null;
      this.available = !!this.client;

      if (this.available) {
        this.logger.log('Redis connection established');
      } else {
        this.logger.warn('Redis connection not available');
      }
    } catch (error) {
      this.logger.error('Redis initialization failed', error);
    }
  }

  /**
   * 设置字符串值
   */
  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    if (!this.available || !this.client) {
      this.logger.debug('Redis not available for SET operation');
      return false;
    }

    try {
      if (ttl) {
        await this.client.setex(key, ttl, value);
      } else {
        await this.client.set(key, value);
      }
      return true;
    } catch (error) {
      this.logger.error('Redis SET operation failed', error);
      return false;
    }
  }

  /**
   * 获取字符串值
   */
  async get(key: string): Promise<string | null> {
    if (!this.available || !this.client) {
      this.logger.debug('Redis not available for GET operation');
      return null;
    }

    try {
      return await this.client.get(key);
    } catch (error) {
      this.logger.error('Redis GET operation failed', error);
      return null;
    }
  }
}
