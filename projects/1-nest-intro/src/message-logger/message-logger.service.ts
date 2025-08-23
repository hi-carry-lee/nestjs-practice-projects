import { Injectable } from '@nestjs/common';
import { MessageFormatterService } from '../message-formatter/message-formatter.service';

@Injectable()
export class MessageLoggerService {
  // inject message formatter service by constructor
  constructor(private readonly messageFormatter: MessageFormatterService) {}

  log(message: string): string {
    const formattedMessage = this.messageFormatter.format(message);
    console.log(formattedMessage);
    return formattedMessage;
  }
}
