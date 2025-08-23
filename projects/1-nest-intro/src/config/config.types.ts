import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AppConfig } from './app.config';
import { AuthConfig } from './auth.config';

// 这里的key，需要和各自注册name space时一致；
export interface RootConfigType {
  app: AppConfig;
  database: TypeOrmModuleOptions;
  auth: AuthConfig;
}
