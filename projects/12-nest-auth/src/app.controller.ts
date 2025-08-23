import { Controller, Get, Res } from '@nestjs/common';
import { AppService } from './app.service';
import { Response } from 'express';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  // 手动注入 response，需要引入 express的Response，然后手动 send才能返回响应
  getHello(@Res() response: Response) {
    response.send(this.appService.getHello());
  }

  @Get('new')
  // 手动注入 response，使用 passthrough: true，可以自动返回
  getHelloNew(@Res({ passthrough: true }) response: Response) {
    response.setHeader('status', 202);
    return this.appService.getHello();
  }
}
