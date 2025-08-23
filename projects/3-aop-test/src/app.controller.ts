import {
  Controller,
  Get,
  Post,
  Query,
  Body,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { AppService } from './app.service';
// import { LoginGuard } from './login.guard';
import { TimeInterceptor } from './aop/time.interceptor';
import { TestFilter } from './aop/test.filter';
import { ValidatePipe } from './aop/validate.pipe';
import { MapTestInterceptor } from './aop/map-test.interceptor';
import { TapTestInterceptor } from './aop/tap-test.interceptor';
import { TimeoutInterceptor } from './aop/timeout.interceptor';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    console.log('appcontroller handler');
    return this.appService.getHello();
  }

  @Get('aaa')
  // @UseGuards(LoginGuard)
  aaa(): string {
    console.log('aaa...');
    return 'aaa';
  }

  @Get('bbb')
  @UseInterceptors(TimeInterceptor)
  bbb(): string {
    console.log('bbb...');
    return 'bbb';
  }

  @Get('ccc')
  @UseFilters(TestFilter)
  ccc(@Query('num', ValidatePipe) num: number): number {
    return num + 1;
  }

  // 用来演示RxJS和Interceptor
  @Get('ddd')
  @UseInterceptors(MapTestInterceptor)
  ddd(): string {
    return 'ddd';
  }

  // 用来演示RxJS和Interceptor
  @Get('eee')
  @UseInterceptors(TapTestInterceptor)
  eee(): string {
    return 'eee';
  }

  // 用来演示RxJS的 timeout operator 和Interceptor
  @Get('fff')
  @UseInterceptors(TimeoutInterceptor)
  async fff() {
    await new Promise((resolve) => setTimeout(resolve, 4000));
    return 'fff';
  }

  // Redis 相关端点
  @Get('hello/cached')
  async getHelloWithCache(): Promise<string> {
    return await this.appService.getHelloWithCache();
  }

  @Post('hello')
  async setHello(@Body('message') message: string): Promise<void> {
    await this.appService.setHello(message);
  }
}
