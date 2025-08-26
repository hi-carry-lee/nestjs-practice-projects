import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalStrategy } from 'src/local.strategy';
import { UserModule } from 'src/user/user.module';
import { JwtStrategy } from 'src/jwt.strategy';
import { GithubStrategy } from 'src/github.strategy';

/*
  为什么 LocalStrategy 要放在 AuthModule 中？
    1. 要使用依赖注入，LocalStrategy需要作为providers，以告诉NestJS如何创建LocalStrategy的实例
    2. 而 LocalStrategy 依赖于 AuthService，所以最好是将它放在当前模块中，这里正好也有AuthService
    3. 如果放在 UserModule 中，则需要将 AuthService 和 LocalStrategy 都放在UserModule的providers中，这样会导致业务逻辑混乱，命名是Auth的业务，却放在了UserModule中
*/

@Module({
  imports: [UserModule],
  providers: [AuthService, LocalStrategy, JwtStrategy, GithubStrategy],
})
export class AuthModule {}
