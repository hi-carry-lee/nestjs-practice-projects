import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RedisModule } from './redis/redis.module';
import { redisConfig, redisConfigSchema } from './redis/redis.config';
import { TypedConfigService } from './typed-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [redisConfig],
      validationSchema: redisConfigSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
    RedisModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: TypedConfigService,
      useExisting: ConfigService,
    },
  ],
})
export class AppModule {}
