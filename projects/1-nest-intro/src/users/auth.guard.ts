import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { AuthConfig } from 'src/config/auth.config';
import { IS_PUBLIC_KEY } from './decorators/public.decorator';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    // here the generic can't use AuthRequest
    const request = context.switchToHttp().getRequest<Request>();
    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException();
    }

    try {
      // * 这里解析出来的 payload 就是 AuthService 中 generateToken 生成的 payload
      // * 里面包含了 sub、name、roles 字段
      const payload = await this.jwtService.verifyAsync<JwtPayload>(token, {
        secret: this.configService.get<AuthConfig>('auth')?.jwt.secret,
      });
      request.user = payload; // 完全类型安全
    } catch {
      // * token过期或无效，都会抛出异常
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}

/*
extractTokenFromHeader参数使用 AuthRequest就会提示：
Unsafe assignment of an error typed value.eslint@typescript-eslint/no-unsafe-assignment
const token: any
原因：
TS推断与ESLint插件的“精准度”和信心分级不同
express.Request 是“官方类型”，ts-plugin 对它的所有属性、方法、返回值都完全信任，自动识别 signature 和各种类型保障。
你自己声明的 AuthRequest 虽然 extends Request，但对 typescript-eslint 插件来说，这已经不是 “原生 Express Request 性质”，
尤其泛型参数/继承复杂时，类型推断链变长，插件的类型分析信心下降，于是遇到链式访问、断言、联合类型时更严格。
另外可能出现的情况是：你定义的某些字段（如 user）扩展得不标准，被推断为 broadened type。
2. 类型扩展与合成，有“丢失”或“不确定”
当扩展成 AuthRequest 后，如果你没完全带上 Express Request 的泛型参数（见上文的泛型写法），ts 有时类型比原版“宽松”，会有 unknown/any。
在代码架构复杂、类型继承/合成链较长时，TS、ESLint 的推理能力不如 Express 原生 Request 类型有自信，遇到复杂解构等操作时就会报 unsafe。
3. 类型检查/代码风格/ESLint规则未必对原生类型和自定义类型一视同仁
有的 lint 规则明确对自定义类型 “更严格” 或 “容易引入 any/unknown” 时就警告。
*/
