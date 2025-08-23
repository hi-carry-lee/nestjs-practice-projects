import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MessageFormatterService } from './message-formatter/message-formatter.service';
import { MessageLoggerService } from './message-logger/message-logger.service';
import { TasksModule } from './tasks/tasks.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { appConfig, appConfigSchema } from './config/app.config';
import { dbConfigSchema, typeOrmConfig } from './config/database.config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { TypedConfigService } from './config/typed-config.service';
import { UsersModule } from './users/users.module';
import { authConfig, authConfigSchema } from './config/auth.config';

const rootConfigSchema = appConfigSchema
  .concat(dbConfigSchema)
  .concat(authConfigSchema);

@Module({
  imports: [
    TasksModule,
    UsersModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: TypedConfigService) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        return {
          ...dbConfig,
          autoLoadEntities: true,
        };
      },
    }),
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, typeOrmConfig, authConfig],
      validationSchema: rootConfigSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    MessageFormatterService,
    MessageLoggerService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}

/*
ESLint报错的原因不是configService.get('database')真的返回了Promise，而是TypeScript类型推断的问题。在不同的上下文中，TypeScript对ConfigService.get()方法的返回类型推断可能不同。
在useFactory中：TypeScript可能无法准确推断configService.get('database')的具体返回类型，特别是当泛型类型RootConfigType比较复杂时。
在服务中：上下文更明确，TypeScript能够正确推断返回类型为非Promise值。

为什么分步操作有效？
1. 类型上下文更清晰
  直接展开 - TypeScript推断可能不准确
  ...configService.get('database')
  类型推断：unknown | Promise<unknown> | undefined（取决于上下文）

  分步操作 - 明确的类型赋值
  const dbConfig = configService.get<TypeOrmModuleOptions>('database');
  类型推断：TypeOrmModuleOptions | undefined（明确非Promise）
  
2. ESLint静态分析的局限性
  ESLint进行静态分析时：
  这种情况下，ESLint可能认为方法调用结果不确定
  return { ...methodCall() }

  这种情况下，ESLint知道变量的类型已经确定
  const result = methodCall();
  return { ...result }

3. 函数表达式 vs 函数体
  箭头函数表达式 - 类型推断上下文有限
  useFactory: (config) => ({ ...config.get('database') })

  函数体 - 更丰富的类型推断上下文
  useFactory: (config) => {
    const dbConfig = config.get('database');
    return { ...dbConfig };
  }
*/

/*
TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      first
      useFactory: (configService: ConfigService<RootConfigType>) => ({
      会提示：Expected a non-Promise value to be spreaded in an object.eslint
        ...configService.get('database'),
      }),
      second
      useFactory: (configService: ConfigService<RootConfigType>) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        return {
          ...dbConfig,
        };
      },
      third
      useFactory: (configService: TypedConfigService) => {
        const dbConfig = configService.get<TypeOrmModuleOptions>('database');
        return {
          ...dbConfig,
          // entities: [Task],
          autoLoadEntities: true,
        };
      },
    }),
*/
