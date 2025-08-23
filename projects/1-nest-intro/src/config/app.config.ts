import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

export interface AppConfig {
  messagePrefix: string;
}

export const appConfigSchema = Joi.object({
  APP_MESSAGE_PREFIX: Joi.string().default('Hello Nestjs '),
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required().default('60m'),
});

export const appConfig = registerAs(
  'app',
  (): AppConfig => ({
    messagePrefix: process.env.APP_MESSAGE_PREFIX ?? 'Hello Nestjs ',
  }),
);
