import { Module } from '@nestjs/common';
import { FieldInjectService } from './field-inject.service';
import { FieldInjectController } from './field-inject.controller';

@Module({
  controllers: [FieldInjectController],
  providers: [FieldInjectService],
  exports: [FieldInjectService],
})
export class FieldInjectModule {}
