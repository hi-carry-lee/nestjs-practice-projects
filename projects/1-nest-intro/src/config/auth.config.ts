import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';

// wrap two properties in a 'jwt' object is not necessary, but it's a good practice to keep the config file clean and readable.
export interface AuthConfig {
  jwt: {
    secret: string;
    expiresIn: string;
  };
}

export const authConfigSchema = Joi.object({
  JWT_SECRET: Joi.string().required(),
  JWT_EXPIRES_IN: Joi.string().required(),
});

export const authConfig = registerAs(
  'auth',
  (): AuthConfig => ({
    jwt: {
      secret: process.env.JWT_SECRET as string,
      expiresIn: process.env.JWT_EXPIRES_IN ?? '60m',
    },
  }),
);
