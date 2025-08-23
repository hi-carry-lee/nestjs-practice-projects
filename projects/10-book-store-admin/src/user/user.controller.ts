import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { UserCreateDto } from './dto/user.create.dto';
import { UserLoginDto } from './dto/user.login.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('register')
  register(@Body() user: UserCreateDto) {
    return this.userService.register(user);
  }

  @Post('login')
  login(@Body() user: UserLoginDto) {
    return this.userService.login(user);
  }
}
