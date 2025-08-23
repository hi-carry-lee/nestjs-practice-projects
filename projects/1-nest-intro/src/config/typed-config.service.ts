import { ConfigService } from '@nestjs/config';
import { RootConfigType } from './config.types';

/*
why this class?
1. ConfigService 没有泛型时：private configService: ConfigService
   它无法提供name space的推断：this.configService.get('app')
  
2. 提供泛型：private configService: ConfigService<RootConfigType>
  可以利用它提供的推断：this.configService.get<AppConfig>('app')?.messagePrefix;

3. 通过这样的类，来实现类型安全增强
  它不是真正的服务，而是一个类型增强器
  继承了 ConfigService 的所有功能
  但为 TypeScript 提供了更好的类型上下文，避免了泛型类型在 DI 中的复杂性，运行时行为完全相同

TS的泛型在运行时会被类型擦除
ConfigService<RootConfigType> 
运行时变成 → ConfigService，这可能导致 NestJS DI 系统混淆

而使用TypedConfigService则可以避免这 NestJS DI 系统的混淆

*/
export class TypedConfigService extends ConfigService<RootConfigType> {}
