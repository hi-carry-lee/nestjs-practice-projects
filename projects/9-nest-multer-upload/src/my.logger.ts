import { LoggerService } from '@nestjs/common';
import * as chalk from 'chalk';
import * as dayjs from 'dayjs';
import { createLogger, format, Logger, transports } from 'winston';
import { safeStringify } from './utils/utils';

export class MyLogger implements LoggerService {
  private logger: Logger;

  constructor() {
    this.logger = createLogger({
      level: 'debug',
      transports: [
        new transports.Console({
          format: format.combine(
            format.colorize(),
            format.printf(({ context, level, message, time }) => {
              const safeContext = safeStringify(context);
              const safeMessage = safeStringify(message);
              const safeTime = safeStringify(time);
              const safeLevel = safeStringify(level);

              const appStr = chalk.green(`[NEST]`);
              const contextStr = chalk.yellow(`[${safeContext}]`);

              return `${appStr} ${safeTime} ${safeLevel} ${contextStr} ${safeMessage} `;
            }),
          ),
        }),
        new transports.File({
          format: format.combine(format.timestamp(), format.json()),
          filename: '111.log',
          dirname: 'log',
        }),
      ],
    });
  }

  log(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', `自定义日志：${message}`, { context, time });
  }

  error(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', `自定义日志：${message}`, { context, time });
  }

  warn(message: string, context: string) {
    const time = dayjs(Date.now()).format('YYYY-MM-DD HH:mm:ss');
    this.logger.log('info', `自定义日志：${message}`, { context, time });
  }
}
