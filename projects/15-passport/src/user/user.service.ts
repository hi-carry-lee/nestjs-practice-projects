import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class UserService {
  private readonly users = [
    {
      userId: 1,
      username: 'test1',
      password: '123456',
    },
    {
      userId: 2,
      username: 'test2',
      password: '123456',
    },
  ];

  findOne(username: string) {
    return this.users.find((user) => user.username === username);
  }

  validateUser(username: string, pass: string) {
    console.log(username, pass);
    const user = this.findOne(username);

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }
    return user;
  }
}
