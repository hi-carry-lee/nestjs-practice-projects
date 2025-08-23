import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): Promise<string> {
    return this.appService.getHello();
  }

  @Post('hello')
  async setHello(@Body('message') message: string): Promise<void> {
    await this.appService.setHello(message);
  }

  @Get('hello/cached')
  getHelloWithCache(): Promise<string> {
    return this.appService.getHelloWithCache();
  }

  @Get('counter')
  incrementCounter(): Promise<number> {
    return this.appService.incrementCounter();
  }

  @Get('user/:userId/session')
  getUserSession(@Param('userId') userId: string) {
    return this.appService.getUserSession(userId);
  }

  @Post('user/:userId/session')
  async setUserSession(
    @Param('userId') userId: string,
    @Body() sessionData: Record<string, string>,
  ): Promise<void> {
    await this.appService.setUserSession(userId, sessionData);
  }

  @Post('user/:userId/list')
  async addToUserList(
    @Param('userId') userId: string,
    @Body('item') item: string,
  ): Promise<void> {
    await this.appService.addToUserList(userId, item);
  }

  @Get('user/:userId/list')
  getUserList(@Param('userId') userId: string): Promise<string[]> {
    return this.appService.getUserList(userId);
  }

  @Post('set/:setName/user/:userId')
  async addUserToSet(
    @Param('setName') setName: string,
    @Param('userId') userId: string,
  ): Promise<void> {
    await this.appService.addUserToSet(setName, userId);
  }

  @Get('set/:setName/user/:userId')
  isUserInSet(
    @Param('setName') setName: string,
    @Param('userId') userId: string,
  ): Promise<boolean> {
    return this.appService.isUserInSet(setName, userId);
  }

  @Get('cache/stats')
  getCacheStats(): Promise<Record<string, any>> {
    return this.appService.getCacheStats();
  }
}
