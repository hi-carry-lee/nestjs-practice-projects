import {
  PipeTransform,
  Injectable,
  ArgumentMetadata,
  BadRequestException,
} from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class MyValidationPipe implements PipeTransform {
  async transform(
    value: unknown,
    { metatype }: ArgumentMetadata,
  ): Promise<unknown> {
    if (!metatype) {
      return value;
    }

    // PipeTestDto
    console.log('metatype: ', metatype);
    // request body中的值
    console.log('value: ', value);

    const object = plainToInstance(metatype, value) as object;
    const errors = await validate(object);

    if (errors.length > 0) {
      throw new BadRequestException('参数验证失败');
    }

    return object;
  }
}
