# NestJS Redis 服务封装

这个项目展示了如何在 NestJS 中优雅地封装和使用 Redis 服务，遵循最佳实践。

## 特性

- ✅ 自动连接管理和错误处理
- ✅ 优雅的降级处理（Redis 不可用时返回默认值）
- ✅ 完整的 Redis 操作封装（String、Hash、List、Set）
- ✅ 类型安全的 API
- ✅ 完整的单元测试覆盖
- ✅ 符合 NestJS 最佳实践

## 安装依赖

```bash
npm install @liaoliaots/nestjs-redis ioredis
```

## 配置

### 1. 模块配置

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisClientService } from './redis-client.service';

@Module({
  imports: [
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          host: 'localhost',
          port: 6379,
          // password: 'your-password', // 可选
          // db: 0, // 可选
        },
      }),
    }),
  ],
  providers: [RedisClientService],
})
export class AppModule {}
```

### 2. 使用环境变量（推荐）

```typescript
// app.module.ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    RedisModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        config: {
          host: configService.get('REDIS_HOST', 'localhost'),
          port: configService.get('REDIS_PORT', 6379),
          password: configService.get('REDIS_PASSWORD'),
          db: configService.get('REDIS_DB', 0),
        },
      }),
      inject: [ConfigService],
    }),
  ],
  providers: [RedisClientService],
})
export class AppModule {}
```

创建 `.env` 文件：

```env
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0
```

## 使用方法

### 1. 在服务中注入

```typescript
// app.service.ts
import { Injectable } from '@nestjs/common';
import { RedisClientService } from './redis-client.service';

@Injectable()
export class AppService {
  constructor(private readonly redisClient: RedisClientService) {}

  async getHello(): Promise<string> {
    // 直接调用，无需检查连接状态
    const cachedValue = await this.redisClient.get('hello-key');
    return cachedValue || 'Hello World! (from cache or default)';
  }

  async setHello(message: string): Promise<void> {
    // 设置缓存，带过期时间（1小时）
    await this.redisClient.set('hello-key', message, 3600);
  }
}
```

### 2. 字符串操作

```typescript
// 基本操作
await this.redisClient.set('key', 'value');
const value = await this.redisClient.get('key');

// 带过期时间
await this.redisClient.set('key', 'value', 3600); // 1小时过期

// 检查存在性
const exists = await this.redisClient.exists('key');

// 删除
await this.redisClient.del('key');

// 设置过期时间
await this.redisClient.expire('key', 1800); // 30分钟

// 获取剩余时间
const ttl = await this.redisClient.ttl('key');
```

### 3. Hash 操作

```typescript
// 设置字段
await this.redisClient.hset('user:1', 'name', 'John');
await this.redisClient.hset('user:1', 'email', 'john@example.com');

// 获取字段
const name = await this.redisClient.hget('user:1', 'name');

// 获取所有字段
const user = await this.redisClient.hgetall('user:1');
// 返回: { name: 'John', email: 'john@example.com' }

// 删除字段
await this.redisClient.hdel('user:1', 'email');
```

### 4. List 操作

```typescript
// 推入元素
await this.redisClient.lpush('list', 'item1');
await this.redisClient.rpush('list', 'item2');

// 弹出元素
const first = await this.redisClient.lpop('list');
const last = await this.redisClient.rpop('list');

// 获取范围
const items = await this.redisClient.lrange('list', 0, -1);
```

### 5. Set 操作

```typescript
// 添加成员
await this.redisClient.sadd('set', 'member1');
await this.redisClient.sadd('set', 'member2');

// 检查成员
const isMember = await this.redisClient.sismember('set', 'member1');

// 获取所有成员
const members = await this.redisClient.smembers('set');

// 移除成员
await this.redisClient.srem('set', 'member1');
```

### 6. 高级操作

```typescript
// 原子递增/递减
const count = await this.redisClient.incr('counter');
const newCount = await this.redisClient.decr('counter');

// 批量操作
const values = await this.redisClient.mget(['key1', 'key2', 'key3']);
await this.redisClient.mset({ key1: 'value1', key2: 'value2' });

// 模式匹配
const keys = await this.redisClient.keys('user:*');

// 获取键类型
const type = await this.redisClient.type('key');
```

## 错误处理

服务会自动处理以下情况：

1. **Redis 连接失败**: 返回默认值，不会抛出异常
2. **Redis 操作失败**: 记录错误日志，返回默认值
3. **Redis 不可用**: 优雅降级，应用继续运行

```typescript
// 即使 Redis 不可用，这些调用也不会抛出异常
const value = await this.redisClient.get('key'); // 返回 null
const success = await this.redisClient.set('key', 'value'); // 返回 false
```

## 测试

运行单元测试：

```bash
npm test
```

运行特定测试：

```bash
npm test -- --testNamePattern="RedisClientService"
```

## 最佳实践

### 1. 键命名规范

```typescript
// 使用冒号分隔的命名空间
const userKey = `user:${userId}:profile`;
const sessionKey = `session:${sessionId}`;
const cacheKey = `cache:${resourceType}:${resourceId}`;
```

### 2. 过期时间管理

```typescript
// 为不同类型的缓存设置合适的过期时间
const CACHE_TTL = {
  USER_SESSION: 7200, // 2小时
  API_CACHE: 1800, // 30分钟
  TEMP_DATA: 300, // 5分钟
  PERMANENT: 0, // 永不过期
};

await this.redisClient.set(
  'user:session:123',
  sessionData,
  CACHE_TTL.USER_SESSION,
);
```

### 3. 批量操作优化

```typescript
// 使用管道批量操作
async function batchSetUserData(userId: string, data: Record<string, string>) {
  const key = `user:${userId}`;
  for (const [field, value] of Object.entries(data)) {
    await this.redisClient.hset(key, field, value);
  }
  // 设置整体过期时间
  await this.redisClient.expire(key, 3600);
}
```

### 4. 监控和日志

```typescript
// 在服务中添加监控
async getCacheStats(): Promise<Record<string, any>> {
  const keys = await this.redisClient.keys('*');
  const stats = {
    totalKeys: keys.length,
    userSessions: 0,
    apiCache: 0,
  };

  for (const key of keys) {
    const type = await this.redisClient.type(key);
    if (key.includes('user:session')) {
      stats.userSessions++;
    } else if (key.includes('api:cache')) {
      stats.apiCache++;
    }
  }

  return stats;
}
```

## 与 Spring Boot 的对比

| 特性     | Spring Boot           | NestJS (本实现)         |
| -------- | --------------------- | ----------------------- |
| 自动配置 | `@EnableCaching`      | `RedisModule.forRoot()` |
| 服务封装 | `RedisTemplate`       | `RedisClientService`    |
| 错误处理 | `@Cacheable` 降级     | 内置降级处理            |
| 类型安全 | 泛型支持              | TypeScript 类型         |
| 测试支持 | `@TestPropertySource` | Jest 模拟               |

## 总结

这个 Redis 服务封装提供了：

1. **简洁的 API**: 业务层直接调用，无需关心连接状态
2. **优雅的错误处理**: 自动降级，不影响应用稳定性
3. **完整的操作支持**: 覆盖 Redis 所有常用操作
4. **类型安全**: 完整的 TypeScript 类型支持
5. **易于测试**: 完整的单元测试覆盖

这种设计模式完全符合 NestJS 的最佳实践，让 Redis 的使用变得简单而可靠。
