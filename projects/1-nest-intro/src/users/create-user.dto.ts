import { IsEmail, IsNotEmpty, Matches, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsNotEmpty()
  name: string;

  // 这三个正则表达式是并联的，只要有一个不满足，就会报错
  @IsNotEmpty()
  @MinLength(6)
  @Matches(/[A-Z]/, {
    message: 'Password must contain at least 1 uppercase letter',
  })
  @Matches(/[0-9]/, {
    message: 'Password must contain at least 1 number',
  })
  // ^ 表示匹配 不属于 中括号里的任何字符，即需要包含special character
  @Matches(/[^A-Za-z0-9]/, {
    message: 'Password must contain at least 1 special character',
  })
  password: string;
}
