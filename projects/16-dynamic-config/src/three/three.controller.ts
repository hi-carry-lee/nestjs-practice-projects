import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ConfigThree } from 'src/config/config-three';

@Controller('three')
export class ThreeController {
  constructor(private readonly configService: ConfigService) {}

  @Get('config')
  findAll() {
    return {
      value: this.configService.get<ConfigThree>('configThree'),
      prefix1: this.configService.get<ConfigThree>('configThree')?.prefix1,
      prefix2: this.configService.get<ConfigThree>('configThree')?.prefix2,
    };
  }
}
