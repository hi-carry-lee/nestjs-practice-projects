import { Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { AaaGuard } from './aaa.guard';
import { Aaa } from './aaa.decorator';
import { Bbb } from './bbb.decorator';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @Aaa('admin-test')
  @UseGuards(AaaGuard)
  async getHello(): Promise<string> {
    return await this.appService.getHello();
  }

  @Bbb('hello1', 'admin-hello1')
  @UseGuards(AaaGuard)
  getHello1(): string {
    return 'this is hello1';
  }

  // 用来测试 Redis
  @Post('hello')
  async setHello(): Promise<void> {
    await this.appService.setHello();
  }
}
