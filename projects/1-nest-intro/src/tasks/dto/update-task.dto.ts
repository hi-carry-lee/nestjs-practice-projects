import { PartialType } from '@nestjs/swagger';
// import { TaskStatus } from './task.model';
import { IsNotEmpty, IsString, ValidateIf } from 'class-validator';
import { CreateTaskDto } from './create-task.dto';

// using mapped type
export class UpdateTaskDto extends PartialType(CreateTaskDto) {
  // used to check null value;
  @ValidateIf((obj: any) => (obj as UpdateTaskDto).desc !== undefined)
  @IsString()
  @IsNotEmpty()
  desc?: string;
}

// manually creating update dto
// export class UpdateTaskDTO {
//   @IsNotEmpty()
//   @IsString()
//   @IsOptional()
//   title?: string;

//   @IsString()
//   @IsNotEmpty()
//   @IsOptional()
//   desc?: string;

//   @IsNotEmpty()
//   @IsEnum(TaskStatus)
//   @IsOptional()
//   status?: TaskStatus;
// }
