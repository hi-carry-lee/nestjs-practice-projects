import { Module } from '@nestjs/common';
import { TasksController } from './tasks.controller';
import { TasksService } from './tasks.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Task } from './entity/task.entity';
import { TaskLabel } from './entity/task-label.entity';

@Module({
  imports: [
    // is essential for dependency injection of TypeORM repositories in the tasks module
    TypeOrmModule.forFeature([Task, TaskLabel]), // 只需要在这里注册
  ],
  controllers: [TasksController],
  providers: [TasksService],
})
export class TasksModule {}
