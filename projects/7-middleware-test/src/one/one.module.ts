import { Module } from '@nestjs/common';
import { OneService } from './one.service';
import { OneController } from './one.controller';

@Module({
  controllers: [OneController],
  providers: [OneService],
  exports: [OneService],
})
export class OneModule {}
