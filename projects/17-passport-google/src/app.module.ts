import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity';

@Module({
  imports: [
    AuthModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      url: 'postgresql://neondb_owner:npg_ATl4qgfYtvw6@ep-long-frog-a1nunemn-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require', // 注意这里需要添加数据库名
      // synchronize: true,
      logging: true,
      entities: [User],
      ssl: {
        rejectUnauthorized: false,
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
