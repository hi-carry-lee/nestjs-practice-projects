import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PersonModule } from './person/person.module';
import { FieldInjectModule } from './field-inject/field-inject.module';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { CccModule } from './ccc/ccc.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisClientService } from './redis-client.service';

@Module({
  imports: [
    PersonModule,
    FieldInjectModule,
    AaaModule,
    BbbModule,
    CccModule, // Redis模块配置
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
  ],
  controllers: [AppController],
  providers: [AppService, RedisClientService],
})
export class AppModule {}
