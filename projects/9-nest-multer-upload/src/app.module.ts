import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { WinstonModule } from './winston/winston.module';
import { LogController } from './log/log.controller';
import { LogService } from './log/log.service';
import { createWinstonConfig } from './winston/winston.config';

@Module({
  imports: [
    WinstonModule.forRoot(createWinstonConfig()), // 🎉 简洁！
  ],
  controllers: [AppController, LogController],
  providers: [AppService, LogService],
})
export class AppModule {}
