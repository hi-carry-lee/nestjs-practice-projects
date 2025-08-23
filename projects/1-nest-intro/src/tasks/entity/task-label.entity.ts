import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { Task } from './task.entity';

/*
business context
1. 每个task可以添加多个标签，所以在task-label表中，既要存储label name，也要存储对应的task id
2. 某些场景下，比如task列表中，需要显示所有的label：
  那么就需要通过task id进行查询，因此需要为这个字段添加一个索引，以加快查询速度；
3. 而我们不希望为同一个task添加相同的label，所以为label name和task id添加联合索引；
*/
@Entity()
@Unique(['name', 'taskId'])
export class TaskLabel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  // 让Postgre为该字段创建索引
  @Index()
  taskId: string;

  @ManyToOne(() => Task, (task) => task.labels, {
    onDelete: 'CASCADE',
    // the best practice is not using it;
    // orphanedRowAction: 'delete',
  })
  task: Task;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
