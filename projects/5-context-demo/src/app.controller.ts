import { Controller, Get, UseFilters, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { TestFilter } from './test.filter';
import { AaaException } from './AaaException';
import { AaaGuard } from './aaa.guard';
import { Role } from './role';
import { Roles } from './roles.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseFilters(TestFilter)
  @UseGuards(AaaGuard)
  @Roles(Role.Admin)
  getHello(): Promise<string> {
    throw new AaaException('aaa', 'bbb');
    // return this.appService.getHello();
  }

  @Get('hello')
  async setHello(): Promise<void> {
    await this.appService.test();
  }
}
