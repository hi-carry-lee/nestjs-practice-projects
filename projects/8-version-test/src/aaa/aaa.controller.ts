import { Controller, Get, Version } from '@nestjs/common';
import { AaaService } from './aaa.service';

@Controller({
  path: 'aaa',
  version: '1',
})
export class AaaController {
  constructor(private readonly aaaService: AaaService) {}

  @Get()
  @Version('2')
  findAllV2() {
    return this.aaaService.findAll() + ' - version2';
  }

  @Get()
  findAll() {
    return this.aaaService.findAll();
  }
}
