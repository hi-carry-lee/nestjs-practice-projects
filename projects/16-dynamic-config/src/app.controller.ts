import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ConfigService } from '@nestjs/config';
import { ConfigThree } from './config/config-three';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly configService: ConfigService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('config')
  getConfig() {
    return {
      position: 'app module',
      aaa: this.configService.get<string>('aaa'),
      bbb: this.configService.get<string>('bbb'),
    };
  }
  @Get('config-two')
  getConfigTwo() {
    return {
      position: 'config file two',
      dbhost: this.configService.get<string>('db.host'),
      dbport: this.configService.get<number>('db.port'),
      port: this.configService.get<number>('port'),
    };
  }

  @Get('config-three')
  getConfigThree() {
    return {
      position: 'config file three',
      // 返回的是一个对象
      value: this.configService.get<ConfigThree>('configThree'),
      // 返回的是一个字符串
      value1: this.configService.get<ConfigThree>('configThree')?.prefix1,
      value2: this.configService.get<ConfigThree>('configThree')?.prefix2,
    };
  }
}
