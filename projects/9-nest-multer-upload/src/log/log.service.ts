import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class LogService {
  // 推荐使用构造时绑定context
  private logger = new Logger(LogService.name);

  list() {
    this.logger.debug('service: aaa');
    this.logger.error('service: bbb');
    this.logger.log('service: ccc');
    this.logger.verbose('service: ddd');
    this.logger.warn('service: eee');
    return 'return value from LogService';
  }
}
