import * as Joi from 'joi';

export interface ConfigTwo {
  port: number;
  db: {
    host: string;
    port: number;
  };
}

export const configTwoSchema = Joi.object({
  PORT: Joi.number().default(3000),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(3306),
});

export async function configTwo(): Promise<ConfigTwo> {
  const dbPort = await Promise.resolve(3306);
  return {
    port: parseInt(process.env.PORT ?? '3000', 10),
    db: {
      host: 'localhost',
      port: dbPort,
    },
  };
}
