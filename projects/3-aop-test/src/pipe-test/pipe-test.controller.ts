import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  HttpException,
  HttpStatus,
  ParseArrayPipe,
  ParseEnumPipe,
  ParseIntPipe,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';
import { PipeTestService } from './pipe-test.service';
import { PipeTestDto } from './dto/pipe-test.dto';
import { MyValidationPipe } from './MyValidationPipe';

enum Ggg {
  A = 'a',
  B = 'b',
  C = 'c',
}

@Controller('pipe-test')
export class PipeTestController {
  constructor(private readonly pipeTestService: PipeTestService) {}

  // 这路由要放在前面，不然被 findAll match上了
  // 如果参数不是数字类型，那么会报错（默认返回400）
  @Get('/aaa')
  aaa(@Query('aa', ParseIntPipe) aa: string) {
    return aa + 1;
  }

  // 可以自定义错误类型：返回任意其他类型
  @Get('/bbb')
  bbb(
    @Query(
      'aa',
      new ParseIntPipe({
        errorHttpStatusCode: HttpStatus.I_AM_A_TEAPOT,
      }),
    )
    aa: string,
  ) {
    return aa + 1;
  }

  // 还可以自定义异常
  @Get('/ccc')
  ccc(
    @Query(
      'aa',
      new ParseIntPipe({
        exceptionFactory: (msg) => {
          console.log(msg);
          throw new HttpException('xxx: ' + msg, HttpStatus.NOT_IMPLEMENTED);
        },
      }),
    )
    aa: string,
  ) {
    return aa + 1;
  }

  // 解析为数组，但是这个无法实现累加，因为每个参数的类型是string
  // 当参数为：arr=1,2,3  返回0123
  @Get('/ddd')
  ddd(@Query('arr', ParseArrayPipe) arr: Array<number>) {
    return arr.reduce((total, item) => total + item, 0);
  }

  // 通过new的方式，然后传入参数
  //
  @Get('/eee')
  eee(
    @Query(
      'arr',
      new ParseArrayPipe({
        items: Number,
        separator: '-', // 还可以指定分隔符：arr=1-2-3
        optional: true, // 不传会报错，使用这个来避免
      }),
    )
    arr: Array<number>,
  ) {
    // 因为query string变为可选了，所以这里要处理下
    if (arr) {
      return arr.reduce((total, item) => total + item, 0);
    }
  }

  // 枚举Pipe，可以限制传参范围 + 将参数转为枚举类型
  @Get('fff')
  fff(
    @Query('ff', new ParseEnumPipe(Ggg))
    ff: Ggg,
  ) {
    return ff;
  }

  // 默认值Pipe，没有传query string，则返回默认值
  @Get('ggg')
  ggg(
    @Query('gg', new DefaultValuePipe('default'))
    gg: string,
  ) {
    return gg;
  }

  @Post('hhh')
  hhh(
    @Body()
    obj: PipeTestDto,
  ) {
    console.log('json param - obj: ', obj);
  }

  // 配合dto中的@IsInt校验
  @Post('jjj')
  jjj(
    @Body(new ValidationPipe())
    obj: PipeTestDto,
  ) {
    console.log('json param - obj: ', obj);
  }

  // 配合dto中的@IsInt校验
  @Post('kkk')
  kkk(
    @Body(new MyValidationPipe())
    obj: PipeTestDto,
  ) {
    console.log('json param - obj: ', obj);
  }
}
