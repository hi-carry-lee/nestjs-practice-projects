import { Controller, Get, Inject, Param } from '@nestjs/common';
import { BbbService } from './bbb.service';

@Controller('bbb')
export class BbbController {
  constructor(
    private readonly bbbService: BbbService,
    @Inject('CONFIG_OPTIONS')
    private readonly test: { name: string; age: number },
  ) {}

  @Get()
  findAll() {
    console.log('BbbController, value from dynamic module: ', this.test);
    return this.bbbService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.bbbService.findOne(+id);
  }
}
