import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { RedisService } from '@liaoliaots/nestjs-redis';
import type { Redis } from 'ioredis';

@Injectable()
export class RedisClientService implements OnModuleInit {
  private readonly logger = new Logger(RedisClientService.name);
  private client: Redis | null = null;
  private available = false;

  constructor(private readonly redisService: RedisService) {}

  onModuleInit() {
    try {
      this.client = this.redisService.getOrNil();
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
   * 检查 Redis 是否可用
   */
  isAvailable(): boolean {
    return this.available && !!this.client;
  }

  /**
   * 获取 Redis 客户端，如果不可用抛出友好错误
   */
  getClient(): Redis {
    if (!this.client) {
      throw new Error('Redis client is not available');
    }
    return this.client;
  }

  /**
   * 安全获取 Redis 客户端，返回 null 如果不可用
   */
  getClientSafe(): Redis | null {
    return this.client;
  }

  /**
   * 通用的安全执行方法
   */
  async execute<T>(
    operation: (client: Redis) => Promise<T>,
    defaultValue?: T,
  ): Promise<T | undefined> {
    if (!this.isAvailable()) {
      this.logger.debug('Redis not available for operation');
      return defaultValue;
    }

    try {
      return await operation(this.client!);
    } catch (error) {
      this.logger.error('Redis operation failed', error);
      return defaultValue;
    }
  }

  // ========== String 操作 ==========

  /**
   * 设置字符串值
   */
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

  /**
   * 获取字符串值
   */
  async get(key: string): Promise<string | null> {
    const result = await this.execute(async (client) => {
      return await client.get(key);
    }, null);
    return result ?? null;
  }

  /**
   * 删除键
   */
  async del(key: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.del(key);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 检查键是否存在
   */
  async exists(key: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.exists(key);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 设置过期时间
   */
  async expire(key: string, seconds: number): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.expire(key, seconds);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 获取剩余过期时间
   */
  async ttl(key: string): Promise<number> {
    const result = await this.execute(async (client) => {
      return await client.ttl(key);
    }, -2);
    return result ?? -2;
  }

  // ========== Hash 操作 ==========

  /**
   * 设置哈希字段
   */
  async hset(key: string, field: string, value: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.hset(key, field, value);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 获取哈希字段
   */
  async hget(key: string, field: string): Promise<string | null> {
    const result = await this.execute(async (client) => {
      return await client.hget(key, field);
    }, null);
    return result ?? null;
  }

  /**
   * 获取整个哈希
   */
  async hgetall(key: string): Promise<Record<string, string> | null> {
    const result = await this.execute(async (client) => {
      return await client.hgetall(key);
    }, null);
    return result ?? null;
  }

  /**
   * 删除哈希字段
   */
  async hdel(key: string, field: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.hdel(key, field);
      return result > 0;
    }, false);
    return result ?? false;
  }

  // ========== List 操作 ==========

  /**
   * 从左侧推入列表
   */
  async lpush(key: string, value: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.lpush(key, value);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 从右侧推入列表
   */
  async rpush(key: string, value: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.rpush(key, value);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 从左侧弹出列表
   */
  async lpop(key: string): Promise<string | null> {
    const result = await this.execute(async (client) => {
      return await client.lpop(key);
    }, null);
    return result ?? null;
  }

  /**
   * 从右侧弹出列表
   */
  async rpop(key: string): Promise<string | null> {
    const result = await this.execute(async (client) => {
      return await client.rpop(key);
    }, null);
    return result ?? null;
  }

  /**
   * 获取列表范围
   */
  async lrange(key: string, start: number, stop: number): Promise<string[]> {
    const result = await this.execute(async (client) => {
      return await client.lrange(key, start, stop);
    }, []);
    return result ?? [];
  }

  // ========== Set 操作 ==========

  /**
   * 添加集合元素
   */
  async sadd(key: string, member: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.sadd(key, member);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 移除集合元素
   */
  async srem(key: string, member: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.srem(key, member);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 检查集合成员
   */
  async sismember(key: string, member: string): Promise<boolean> {
    const result = await this.execute(async (client) => {
      const result = await client.sismember(key, member);
      return result > 0;
    }, false);
    return result ?? false;
  }

  /**
   * 获取集合所有成员
   */
  async smembers(key: string): Promise<string[]> {
    const result = await this.execute(async (client) => {
      return await client.smembers(key);
    }, []);
    return result ?? [];
  }

  // ========== 高级操作 ==========

  /**
   * 原子递增
   */
  async incr(key: string): Promise<number | null> {
    const result = await this.execute(async (client) => {
      return await client.incr(key);
    }, null);
    return result ?? null;
  }

  /**
   * 原子递减
   */
  async decr(key: string): Promise<number | null> {
    const result = await this.execute(async (client) => {
      return await client.decr(key);
    }, null);
    return result ?? null;
  }

  /**
   * 批量获取
   */
  async mget(keys: string[]): Promise<(string | null)[]> {
    const result = await this.execute(
      async (client) => {
        return await client.mget(...keys);
      },
      keys.map(() => null),
    );
    return result ?? keys.map(() => null);
  }

  /**
   * 批量设置
   */
  async mset(keyValuePairs: Record<string, string>): Promise<boolean> {
    const result = await this.execute(async (client) => {
      await client.mset(keyValuePairs);
      return true;
    }, false);
    return result ?? false;
  }

  /**
   * 模式匹配查找键
   */
  async keys(pattern: string): Promise<string[]> {
    const result = await this.execute(async (client) => {
      return await client.keys(pattern);
    }, []);
    return result ?? [];
  }

  /**
   * 获取键类型
   */
  async type(key: string): Promise<string | null> {
    const result = await this.execute(async (client) => {
      return await client.type(key);
    }, null);
    return result ?? null;
  }
}
