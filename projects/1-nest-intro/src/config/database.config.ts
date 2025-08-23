import { registerAs } from '@nestjs/config';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as Joi from 'joi';

// create its own schema, then combine all the schemas in the appModule;
export const dbConfigSchema = Joi.object({
  APP_MESSAGE_PREFIX: Joi.string().default('Hello '),
  DB_HOST: Joi.string().default('localhost'),
  DB_PORT: Joi.number().default(5432),
  DB_USER: Joi.string().required(),
  DB_PASSWORD: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DB_SYNC: Joi.number().valid('true', 'false').required(),
});

// unlike app.config, we don't need to create a interface,
// since TypeORM provide one: TypeOrmModuleOptions
export const typeOrmConfig = registerAs(
  'database',
  (): TypeOrmModuleOptions => ({
    // 通过host, port, username, password, database 这样单独配置的方式连接数据库，
    // 是 TypeORM 提供一种通用方式，也支持MySQL，MongoDB等其他数据库
    type: 'postgres',
    host: process.env.DB_HOST ?? 'localhost',
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USER ?? 'postgres',
    password: process.env.DB_PASSWORD ?? 'postgres',
    database: process.env.DB_DATABASE ?? 'tasks',
    synchronize: process.env.DB_SYNC === 'true',
  }),
);
/*
关于 synchronize 的说明
1. 作用：当设置为 true 时，TypeORM 会：
  自动创建表：根据你的 Entity 定义创建数据库表
  自动更新表结构：当你修改 Entity 时，自动修改对应的表结构
  自动添加/删除列：根据 Entity 属性的变化

2. 使用场景：
  开发环境、本地测试
  生产环境禁用

3. 生产环境对于table的操作，依赖 migration 来实现
  TyepOrm 和 Prisma 都提供了对应的迁移文件和命令；

*/
