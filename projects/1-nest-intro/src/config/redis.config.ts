import { registerAs } from '@nestjs/config';
import { RedisOptions } from 'ioredis';
import * as Joi from 'joi';

export const redisConfigSchema = Joi.object({
  REDIS_HOST: Joi.string().default('localhost'),
  REDIS_PORT: Joi.number().default(6379),
});

export const redisConfig = registerAs(
  'redis',
  (): RedisOptions => ({
    host: process.env.REDIS_HOST ?? 'localhost',
    port: parseInt(process.env.REDIS_PORT ?? '6379'),
  }),
);
