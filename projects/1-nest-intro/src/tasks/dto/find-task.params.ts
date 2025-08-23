import { IsEnum, IsIn, IsOptional, IsString, MinLength } from 'class-validator';
import { TaskStatus } from '../task.model';
import { PaginationParams } from 'src/common/pagination.params';
import { Transform } from 'class-transformer';

export class FindTaskParams extends PaginationParams {
  @IsOptional()
  @IsEnum(TaskStatus)
  status?: TaskStatus;

  @IsOptional()
  @MinLength(3)
  @IsString()
  title?: string;

  @IsOptional()
  @MinLength(3)
  @IsString()
  desc?: string;

  @IsOptional()
  @IsString({ each: true })
  @Transform(({ value }: { value?: string }) => {
    if (!value) return undefined;
    return value
      .split(',')
      .map((label) => label.trim())
      .filter((label) => label.length);
  })
  labels: string[];

  @IsOptional()
  @IsIn(['createdAt', 'title', 'status'])
  sortBy?: string = 'createdAt';

  @IsOptional()
  @IsEnum(['ASC', 'DESC'])
  sortOrder?: 'ASC' | 'DESC' = 'DESC';
}
