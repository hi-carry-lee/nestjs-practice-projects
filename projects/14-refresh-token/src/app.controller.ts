import { Controller, Get, UseGuards } from '@nestjs/common';
import { AppService } from './app.service';
import { LoginGuard } from './login.guard';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('no-login')
  test1() {
    return 'nologin success';
  }

  @Get('login-guard')
  @UseGuards(LoginGuard)
  test2() {
    return 'login success';
  }
}
