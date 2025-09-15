import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigThree } from 'src/config/config-three';
import { ConfigTwo } from 'src/config/config-two';

@Controller('two')
export class TwoController {
  constructor(private readonly configService: ConfigService) {}

  @Get('config')
  findAll() {
    return {
      port: this.configService.get<ConfigTwo>('port'),
      dbhost: this.configService.get<ConfigTwo>('db.host'),
      dbport: this.configService.get<ConfigTwo>('db.port'),
    };
  }

  // 不会报错，因为已经全部load了配置文件
  @Get('error')
  findAllError() {
    return {
      value: this.configService.get<ConfigThree>('configThree'),
      prefix1: this.configService.get<ConfigThree>('configThree')?.prefix1,
      prefix2: this.configService.get<ConfigThree>('configThree')?.prefix2,
    };
  }
}
