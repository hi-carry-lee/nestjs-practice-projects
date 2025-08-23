import { IsNotEmpty, MinLength } from 'class-validator';

export class UserCreateDto {
  @IsNotEmpty()
  username: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
