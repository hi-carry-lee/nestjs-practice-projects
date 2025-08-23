import { Injectable } from '@nestjs/common';
import { MessageLoggerService } from './message-logger/message-logger.service';
// import { ConfigService } from '@nestjs/config';
// import { RootConfigType } from './config/config.types';
import { AppConfig } from './config/app.config';
import { TypedConfigService } from './config/typed-config.service';

@Injectable()
export class AppService {
  // inject message logger service by constructor
  constructor(
    private readonly messageLogger: MessageLoggerService,
    // when we create TypedConfigService
    // private configService: ConfigService<RootConfigType>,
    private configService: TypedConfigService,
  ) {}

  getHello(): string {
    const message = this.messageLogger.log('Hello World!');
    const prefix = this.configService.get<AppConfig>('app')?.messagePrefix;
    return `${prefix} ${message}`;
  }
}
