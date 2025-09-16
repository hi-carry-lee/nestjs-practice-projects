import { Injectable } from '@nestjs/common';
import {
  InjectDataSource,
  InjectEntityManager,
  InjectRepository,
} from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';

@Injectable()
export class UserService {
  // 带有事务的时候，推荐使用它
  @InjectEntityManager()
  private manager: EntityManager;

  // 原生sql的时候，推荐使用它
  @InjectDataSource()
  private dataSource: DataSource;

  // 日常使用，需要在Module中注入Entity：TypeOrmModule.forFeature([User]
  @InjectRepository(User)
  private userRepository: Repository<User>;

  async create(createUserDto: CreateUserDto) {
    return await this.manager.save(User, createUserDto);
  }

  findAll() {
    return this.manager.find(User);
  }

  findOne(id: number) {
    return this.manager.findOne(User, {
      where: { id },
    });
  }

  async update(id: number, updateUserDto: UpdateUserDto) {
    await this.userRepository.update(id, updateUserDto);
  }

  async remove(id: number) {
    await this.dataSource.manager.delete(User, id);
  }
}
