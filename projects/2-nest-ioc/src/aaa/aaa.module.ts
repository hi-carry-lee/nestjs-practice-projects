import {
  Global,
  Module,
  OnApplicationBootstrap,
  OnModuleInit,
} from '@nestjs/common';
import { AaaService } from './aaa.service';
import { AaaController } from './aaa.controller';

@Global()
@Module({
  controllers: [AaaController],
  providers: [AaaService],
  exports: [AaaService],
})
export class AaaModule implements OnModuleInit, OnApplicationBootstrap {
  onModuleInit() {
    console.log('AaaModule onModuleInit.');
  }
  onApplicationBootstrap() {
    console.log('AaaModule onApplicationBootstrap.');
  }

  onModuleDestroy() {
    console.log('AaaModule onModuleDestroy.');
  }

  beforeApplicationShutdown() {
    console.log('AaaModule beforeApplicationShutdown.');
  }

  onApplicationShutdown() {
    console.log('AaaModule onApplicationShutdown.');
  }
}
