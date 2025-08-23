import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { UserService } from './user.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Response } from 'express';
import { LoginGuard } from 'src/guards/login.guard';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body(ValidationPipe) registerDto: RegisterDto) {
    console.log(registerDto);
    await this.userService.register(registerDto);
  }

  @Post('login')
  async login(
    @Res({ passthrough: true }) res: Response,
    @Body(ValidationPipe) loginDto: LoginDto,
  ) {
    console.log(loginDto);
    const foundUser = await this.userService.login(loginDto);
    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
        },
      });
      res.setHeader('token', token);
      return 'login success';
    } else {
      return 'login fail';
    }
  }

  @Post('login-permission')
  async loginWithPermissions(
    @Res({ passthrough: true }) res: Response,
    @Body(ValidationPipe) loginDto: LoginDto,
  ) {
    console.log(loginDto);
    const foundUser = await this.userService.loginWithPermissions(loginDto);
    if (foundUser) {
      const token = await this.jwtService.signAsync({
        user: {
          id: foundUser.id,
          username: foundUser.username,
          permissions: foundUser.permissions,
        },
      });
      res.setHeader('token', token);
      return 'login success';
    } else {
      return 'login fail';
    }
  }

  @Get('test1')
  @UseGuards(LoginGuard)
  test1() {
    return 'test login with token';
  }

  @Get('test2')
  test2() {
    return 'test login without token';
  }

  @Get('init')
  async init() {
    await this.userService.initData();
    return 'Init done!';
  }
}
