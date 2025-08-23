import { Module } from '@nestjs/common';
import { PipeTestService } from './pipe-test.service';
import { PipeTestController } from './pipe-test.controller';

@Module({
  controllers: [PipeTestController],
  providers: [PipeTestService],
})
export class PipeTestModule {}
