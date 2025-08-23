import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Query,
  Logger,
  Inject,
} from '@nestjs/common';
import { LogService } from './log.service';
import { WINSTON_LOGGER_TOKEN } from 'src/winston/winston.module';
import { NewLogger } from 'src/winston/new.logger';

class LogDto {
  name: string;
  age: number;
}

@Controller('log')
export class LogController {
  constructor(private logService: LogService) {}
  private logger = new Logger();

  @Inject(WINSTON_LOGGER_TOKEN)
  private newLogger: NewLogger;

  @Get('list')
  list(@Query('name') name: string) {
    this.logger.debug('aaa', LogController.name);
    this.logger.error('bbb', LogController.name);
    this.logger.log('ccc', LogController.name);
    this.logger.verbose('ddd', LogController.name);
    this.logger.warn('eee', LogController.name);

    console.log('get接口 - list，参数name: ', name);
    this.logService.list();

    this.newLogger.log('这是动态Module实现的logger', LogController.name);
    return 'list ';
  }

  @Get(':id')
  findById(@Param('id') id: number) {
    console.log('id: ', id);
    return 'find by id';
  }

  @Post('create')
  create(@Body() logDto: LogDto) {
    console.log('post接口参数 logDto: ', logDto);
    return 'create something';
  }

  @Put('update')
  update(@Body() logDto: LogDto) {
    console.log('put接口参数 logDto: ', logDto);
    return 'update something';
  }
}
