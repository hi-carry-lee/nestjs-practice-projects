import { Injectable } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';

@Injectable()
export class AppService {
  constructor(private readonly redisClient: RedisClientService) {}

  async getHello(): Promise<string> {
    // 现在可以直接调用Redis方法，无需检查连接状态
    const cachedValue = await this.redisClient.get('hello-key');
    return cachedValue || 'Hello World! (from cache or default)';
  }

  async setHello(message: string): Promise<void> {
    // 设置缓存，带过期时间（1小时）
    await this.redisClient.set('hello-key', message, 3600);
  }

  async getHelloWithCache(): Promise<string> {
    // 检查缓存是否存在
    const exists = await this.redisClient.exists('hello-key');
    if (exists) {
      const value = await this.redisClient.get('hello-key');
      return `Cached: ${value}`;
    }

    // 模拟从数据库获取数据
    const data = 'Hello from database!';

    // 缓存数据
    await this.redisClient.set('hello-key', data, 1800); // 30分钟过期

    return `Fresh: ${data}`;
  }

  async incrementCounter(): Promise<number> {
    // 原子递增计数器
    const count = await this.redisClient.incr('visit-counter');
    return count || 0;
  }

  async getUserSession(userId: string): Promise<Record<string, string> | null> {
    // 使用Hash存储用户会话信息
    return await this.redisClient.hgetall(`user:session:${userId}`);
  }

  async setUserSession(
    userId: string,
    sessionData: Record<string, string>,
  ): Promise<void> {
    // 批量设置用户会话信息
    const key = `user:session:${userId}`;
    for (const [field, value] of Object.entries(sessionData)) {
      await this.redisClient.hset(key, field, value);
    }
    // 设置过期时间
    await this.redisClient.expire(key, 7200); // 2小时过期
  }

  async addToUserList(userId: string, item: string): Promise<void> {
    // 添加到用户列表
    await this.redisClient.lpush(`user:list:${userId}`, item);
  }

  async getUserList(userId: string): Promise<string[]> {
    // 获取用户列表
    return await this.redisClient.lrange(`user:list:${userId}`, 0, -1);
  }

  async addUserToSet(setName: string, userId: string): Promise<void> {
    // 添加用户到集合
    await this.redisClient.sadd(setName, userId);
  }

  async isUserInSet(setName: string, userId: string): Promise<boolean> {
    // 检查用户是否在集合中
    return await this.redisClient.sismember(setName, userId);
  }

  async getCacheStats(): Promise<Record<string, any>> {
    // 获取缓存统计信息
    const keys = await this.redisClient.keys('*');
    const stats = {
      totalKeys: keys.length,
      userSessions: 0,
      counters: 0,
      lists: 0,
      sets: 0,
    };

    for (const key of keys) {
      const type = await this.redisClient.type(key);
      if (type === 'hash' && key.includes('user:session')) {
        stats.userSessions++;
      } else if (type === 'string' && key.includes('counter')) {
        stats.counters++;
      } else if (type === 'list') {
        stats.lists++;
      } else if (type === 'set') {
        stats.sets++;
      }
    }

    return stats;
  }
}
