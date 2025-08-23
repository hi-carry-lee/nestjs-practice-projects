import { Controller, Get, Param } from '@nestjs/common';
import { OneService } from './one.service';

@Controller('one')
export class OneController {
  constructor(private readonly oneService: OneService) {}

  @Get()
  findAll() {
    return this.oneService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.oneService.findOne(+id);
  }
}
