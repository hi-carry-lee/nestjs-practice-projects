import { TaskStatus } from '../task.model';
import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateTaskLabelDto } from './create-task-label.dto';
import { Type } from 'class-transformer';

export class CreateTaskDto {
  @IsOptional()
  @IsUUID()
  userId?: string;

  @IsNotEmpty()
  @IsString()
  title: string;

  @IsString({ message: 'should be string' })
  @IsNotEmpty()
  desc: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;

  @IsOptional()
  // 因为这个属性的类型是嵌套的，所以想要在validate CreateTaskDTO的同时，也validate CreateTaskLabelDto，则需要这个装饰器：ValidateNested
  // each: true：表示validate每一个字段
  @ValidateNested({ each: true })
  // why mark the Type again, since it has already define it in the labels definition?
  // Since CreateTaskLabelDto[] is a TS type, it's only existing in compilation phrase, but Nestjs need the type to conver plain data from http request in the runtime, so we need to specify type again in decorator;
  @Type(() => CreateTaskLabelDto)
  labels?: CreateTaskLabelDto[];
}
