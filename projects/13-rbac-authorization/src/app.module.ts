import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './user/user.module';
import { TestOneModule } from './test-one/test-one.module';
import { TestTwoModule } from './test-two/test-two.module';
import { LoginGuard } from './guards/login.guard';
import { APP_GUARD } from '@nestjs/core';
import { PermissionGuard } from './guards/permission.guard';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'nest-auth-test',
      signOptions: {
        expiresIn: '7d',
      },
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'admin',
      password: '123456',
      database: 'authorization-test',
      synchronize: true,
      // logging: true,
      autoLoadEntities: true,
    }),
    UserModule,
    TestOneModule,
    TestTwoModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: LoginGuard,
    },
    {
      provide: APP_GUARD,
      useClass: PermissionGuard,
    },
  ],
})
export class AppModule {}
