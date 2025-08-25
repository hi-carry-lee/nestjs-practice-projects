/* eslint-disable @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access*/
/*
上面的Eslint配置，是因为：
ESLint配置使用了 tseslint.configs.recommendedTypeChecked，这启用了严格的类型检查规则。

构造函数调用问题：
在 JwtStrategy 的构造函数中，调用了 super() 并传递了配置对象，但ESLint认为这个调用可能不安全，因为：
  PassportStrategy(Strategy) 返回的类型可能不够明确，配置对象的类型可能不够严格
*/

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

interface JwtUserData {
  userId: number;
  username: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'secret',
    });
    /*
    这里必须再次设置secret，因为：
    1. 不同的用途
    JwtModule的secret：用于生成JWT token（签名）
    JwtStrategy的secretOrKey：用于验证JWT token（验签）
    2. 不同的组件
    JwtModule：NestJS的JWT模块，负责token的生成和验证
    JwtStrategy：Passport.js的策略，负责从请求中提取和验证token
    */
  }

  validate(payload: JwtUserData) {
    console.log(payload);
    return { userId: payload.userId, username: payload.username };
  }
}

/*
1. Passport.js类型定义不够完善 ✅
从搜索结果可以看出：
只有你的项目使用了 ExtractJwt.fromAuthHeaderAsBearerToken()
其他项目都直接使用 @nestjs/jwt 的 JwtService，避免了Passport.js的类型问题
passport-jwt@4.0.1 和 @types/passport-jwt@4.0.1 的类型定义确实存在兼容性问题

2. TypeScript类型推断的局限性 ✅
ExtractJwt.fromAuthHeaderAsBearerToken() 返回的类型被推断为 error 类型
这是因为Passport.js的类型定义文件可能使用了复杂的类型结构
TypeScript无法准确推断出具体的函数类型

3. ESLint严格模式的过度检查 ✅
你使用的 tseslint.configs.recommendedTypeChecked 是最严格的配置
当TypeScript无法100%确定类型时，ESLint会报错
这是ESLint的保守策略，防止潜在的类型安全问题

*/
