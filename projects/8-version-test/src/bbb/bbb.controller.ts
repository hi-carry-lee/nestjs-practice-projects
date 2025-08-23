import { Controller, Get, Version, VERSION_NEUTRAL } from '@nestjs/common';
import { BbbService } from './bbb.service';

@Controller({
  path: 'bbb',
  // version: VERSION_NEUTRAL,
  version: '1',
})
export class BbbController {
  constructor(private readonly bbbService: BbbService) {}

  @Get('test1')
  test1() {
    return 'test1';
  }

  @Get('test2')
  test2() {
    return 'test2';
  }

  @Get()
  @Version('1')
  findAllV1() {
    return this.bbbService.findAll() + '- version 1';
  }

  @Get()
  @Version('2')
  findAllV2() {
    return this.bbbService.findAll() + '- version 2';
  }

  @Get()
  @Version(VERSION_NEUTRAL)
  findAllV3() {
    return this.bbbService.findAll() + '- VERSION_NEUTRAL';
  }

  // @Get()
  // findAll() {
  //   return this.bbbService.findAll();
  // }
}
