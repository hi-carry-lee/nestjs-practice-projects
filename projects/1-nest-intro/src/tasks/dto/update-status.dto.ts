import { TaskStatus } from '../task.model';
import { IsEnum, IsNotEmpty, IsString, IsUUID } from 'class-validator';

export class UpdateTaskStatusDto {
  @IsNotEmpty()
  @IsString()
  @IsUUID()
  id: string;

  @IsNotEmpty()
  @IsEnum(TaskStatus)
  status: TaskStatus;
}
