import { BadRequestException, Injectable } from '@nestjs/common';
import { DbService } from 'src/db/db.service';
import { UserCreateDto } from './dto/user.create.dto';
import { User } from './entity/user.entity';
import { UserLoginDto } from './dto/user.login.dto';

@Injectable()
export class UserService {
  constructor(private readonly dbService: DbService) {}

  async register(registerUserDto: UserCreateDto) {
    const users: User[] = await this.dbService.read<User>();

    const foundUser = users.find(
      (item) => item.username === registerUserDto.username,
    );

    if (foundUser) {
      throw new BadRequestException('该用户已经注册');
    }

    const user = new User();
    user.username = registerUserDto.username;
    user.password = registerUserDto.password;
    users.push(user);

    await this.dbService.write(users);
    return user;
  }

  async login(loginUserDto: UserLoginDto) {
    const users: User[] = await this.dbService.read<User>();

    const foundUser = users.find(
      (item) => item.username === loginUserDto.username,
    );

    if (!foundUser) {
      throw new BadRequestException('该用户未注册');
    }
    if (foundUser.password !== loginUserDto.password) {
      throw new BadRequestException('密码不正确');
    }

    return foundUser;
  }
}
