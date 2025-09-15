import { Controller, Get } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Controller('first')
export class FirstController {
  constructor(private readonly configService: ConfigService) {}

  @Get('config')
  findAll() {
    return {
      position: 'first module',
      aaa: this.configService.get<string>('aaa'),
    };
  }
}
