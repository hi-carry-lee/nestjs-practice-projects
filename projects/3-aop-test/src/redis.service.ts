// redis.service.ts
import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);
  private redis: Redis | null = null;
  private available = false;

  async onModuleInit() {
    try {
      this.redis = new Redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
      });

      // 监听连接事件
      this.redis.on('connect', () => {
        this.logger.log('Redis connected');
        this.available = true;
      });

      this.redis.on('error', (error) => {
        this.logger.error('Redis connection error:', error);
        this.available = false;
      });

      this.redis.on('close', () => {
        this.logger.warn('Redis connection closed');
        this.available = false;
      });

      this.redis.on('reconnecting', () => {
        this.logger.log('Redis reconnecting...');
      });

      // 连接 Redis
      await this.redis.connect();
    } catch (error) {
      this.logger.error('Redis initialization failed:', error);
      this.available = false;
    }
  }

  async onModuleDestroy() {
    if (this.redis) {
      await this.redis.quit();
      this.logger.log('Redis connection closed');
    }
  }

  // 检查连接状态
  isAvailable(): boolean {
    return this.available && this.redis?.status === 'ready';
  }

  // 获取 Redis 客户端
  getClient(): Redis {
    if (!this.redis || !this.isAvailable()) {
      throw new Error('Redis is not available');
    }
    return this.redis;
  }

  // 安全执行方法
  async execute<T>(
    operation: (client: Redis) => Promise<T>,
    defaultValue?: T,
  ): Promise<T | undefined> {
    if (!this.isAvailable()) {
      this.logger.debug('Redis not available for operation');
      return defaultValue;
    }

    try {
      return await operation(this.redis!);
    } catch (error) {
      this.logger.error('Redis operation failed:', error);
      return defaultValue;
    }
  }

  // ========== String 操作 ==========
  async set(key: string, value: string, ttl?: number): Promise<boolean> {
    const result = await this.execute(async (client) => {
      if (ttl) {
        await client.setex(key, ttl, value);
      } else {
        await client.set(key, value);
      }
      return true;
    }, false);
    return result ?? false;
  }

  async get(key: string): Promise<string | null> {
    const result = await this.execute(async (client) => {
      return await client.get(key);
    }, null);
    return result ?? null;
  }

  async del(key: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.del(key);
      return result > 0;
    }, false);
    return result ?? false;
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.exists(key);
      return result > 0;
    }, false);
    return result ?? false;
  }

  // ========== Hash 操作 ==========
  async hset(key: string, field: string, value: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.hset(key, field, value);
      return result > 0;
    }, false);
    return result ?? false;
  }

  async hget(key: string, field: string): Promise<string | null> {
    const result = await this.execute(async (client) => {
      return await client.hget(key, field);
    }, null);
    return result ?? null;
  }

  async hgetall(key: string): Promise<Record<string, string> | null> {
    const result = await this.execute(async (client) => {
      return await client.hgetall(key);
    }, null);
    return result ?? null;
  }

  // ========== List 操作 ==========
  async lpush(key: string, value: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.lpush(key, value);
      return result > 0;
    }, false);
    return result ?? false;
  }

  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const result = await this.execute(async (client) => {
      return await client.lrange(key, start, stop);
    }, []);
    return result ?? [];
  }

  // ========== Set 操作 ==========
  async sadd(key: string, member: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.sadd(key, member);
      return result > 0;
    }, false);
    return result ?? false;
  }

  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.sismember(key, member);
      return result > 0;
    }, false);
    return result ?? false;
  }

  // ========== 高级操作 ==========
  async incr(key: string): Promise<number | null> {
    const result = await this.execute(async (client) => {
      return await client.incr(key);
    }, null);
    return result ?? null;
  }

  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.expire(key, seconds);
      return result > 0;
    }, false);
    return result ?? false;
  }
}
