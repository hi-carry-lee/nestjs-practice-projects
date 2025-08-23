import { Module } from '@nestjs/common';
import { TokenTestController } from './TokenTestController';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      secret: '12',
      signOptions: {
        expiresIn: '7d',
      },
    }),
  ],
  controllers: [TokenTestController],
})
export class TokenTestModule {}
