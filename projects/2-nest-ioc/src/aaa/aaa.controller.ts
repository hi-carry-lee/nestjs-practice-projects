import {
  Controller,
  Get,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { AaaService } from './aaa.service';

@Controller('aaa')
export class AaaController implements OnModuleInit, OnApplicationBootstrap {
  constructor(private readonly aaaService: AaaService) {}

  onModuleInit() {
    console.log('AaaController onModuleInit.');
  }
  onApplicationBootstrap() {
    console.log('AaaController onApplicationBootstrap.');
  }

  onModuleDestroy() {
    console.log('AaaController onModuleDestroy.');
  }
  beforeApplicationShutdown() {
    console.log('AaaController beforeApplicationShutdown.');
  }
  onApplicationShutdown() {
    console.log('AaaController onApplicationShutdown.');
  }

  @Get()
  findAll() {
    return this.aaaService.findAll();
  }
}
