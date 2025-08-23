import { Test, TestingModule } from '@nestjs/testing';
import { MessageLoggerService } from './message-logger.service';

describe('MessageLoggerService', () => {
  let service: MessageLoggerService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MessageLoggerService],
    }).compile();

    service = module.get<MessageLoggerService>(MessageLoggerService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
