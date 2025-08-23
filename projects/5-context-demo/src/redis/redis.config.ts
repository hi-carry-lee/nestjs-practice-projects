import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import * as Joi from 'joi';

export const redisConfigSchema = Joi.object({
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
  REDIS_PASSWORD: Joi.string().allow('').optional(),
  REDIS_DB: Joi.number().default(0),
});

export const redisConfig = registerAs(
  'redis',
  (): RedisOptions => ({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
    password: process.env.REDIS_PASSWORD,
    db: parseInt(process.env.REDIS_DB ?? '0'),
    lazyConnect: true,
    connectTimeout: 10000,
    keepAlive: 30000,
    family: 4,
    maxRetriesPerRequest: 3,

    enableOfflineQueue: false,

    enableReadyCheck: true,
  }),
);
