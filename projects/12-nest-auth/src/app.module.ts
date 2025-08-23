import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TokenTestModule } from './token-test/tokenTest.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { AaaModule } from './aaa/aaa.module';
import { BbbModule } from './bbb/bbb.module';
import { GuardModule } from './guards/guard.module';
import { RedisModule } from '@liaoliaots/nestjs-redis';
import { RedisClientModule } from './redis/redis.module';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'nest-auth-test',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    TokenTestModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: '123456',
      database: 'auth-test',
      synchronize: true,
      logging: true,
      autoLoadEntities: true,
    }),
    RedisModule.forRootAsync({
      useFactory: () => ({
        config: {
          host: 'localhost',
          port: 6379,
        },
      }),
    }),
    UserModule,
    AaaModule,
    BbbModule,
    GuardModule,
    RedisClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
