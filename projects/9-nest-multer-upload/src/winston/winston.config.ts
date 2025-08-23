// src/logger/winston.config.ts
import { LoggerOptions } from 'winston';
import { format, transports } from 'winston';
import * as chalk from 'chalk';
import { safeStringify } from '../utils/utils';

export function createWinstonConfig(): LoggerOptions {
  return {
    level: process.env.LOG_LEVEL || 'debug',
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
            return `${appStr} ${safeTime} ${safeLevel} ${contextStr} ${safeMessage}`;
          }),
        ),
      }),
      new transports.File({
        format: format.combine(format.timestamp(), format.json()),
        filename: 'app.log',
        dirname: 'logs',
      }),
    ],
  };
}
