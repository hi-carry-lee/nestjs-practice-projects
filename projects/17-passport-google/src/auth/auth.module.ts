import { Module } from '@nestjs/common';
import { GoogleStrategy } from './google.strategy';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: 'hello',
      signOptions: { expiresIn: '15m' },
    }),
  ],
  providers: [GoogleStrategy, AuthService],
  exports: [AuthService],
})
export class AuthModule {}
