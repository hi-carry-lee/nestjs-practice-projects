import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ValidationPipe,
  Res,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private jwtService: JwtService,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Post('login')
  async login(
    @Body(ValidationPipe) loginDto: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log(loginDto);
    const user = await this.userService.login(loginDto);

    if (!user) {
      return 'login fail';
    }

    const token = this.jwtService.sign({
      user: {
        id: user.id,
        username: user.username,
        roles: user.roles,
      },
    });

    res.setHeader('token', token);
    return 'login success';
  }

  @Get('init')
  async initData() {
    await this.userService.initData();
    return 'init data done';
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}
