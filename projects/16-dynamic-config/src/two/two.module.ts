import { Module } from '@nestjs/common';
import { TwoController } from './two.controller';
import { configTwo } from 'src/config/config-two';
import { ConfigModule } from '@nestjs/config';

@Module({
  controllers: [TwoController],
  imports: [ConfigModule.forFeature(configTwo)],
})
export class TwoModule {}
