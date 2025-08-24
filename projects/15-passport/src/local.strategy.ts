import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

/*
1. class可以继承函数，但这个“函数”必须是一个“返回类的高阶函数”；
2. PassportStrategy(Strategy) 其实是一个“工厂函数”，它接收一个构造函数（如 passport-local 的 Strategy），返回一个新的类，这个类内部实现了 NestJS 需要的接口
3. 为什么PassportStrategy不是普通class？ NestJS 这样设计是为了兼容各种 passport 策略（local、jwt、oauth 等），用工厂函数动态生成继承关系和类型。
*/

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  validate(username: string, password: string) {
    const user = this.authService.validateUser(username, password);
    return user;
  }
}
