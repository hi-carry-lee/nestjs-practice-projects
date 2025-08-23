import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TaskStatus } from '../task.model';
import { User } from 'src/users/user.entity';
import { TaskLabel } from './task-label.entity';

@Entity()
export class Task {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({
    type: 'varchar',
    length: 100,
    nullable: true,
  })
  title: string;

  @Column({
    type: 'text',
    nullable: true,
  })
  desc: string;

  @Column({
    type: 'enum',
    enum: TaskStatus,
    default: TaskStatus.OPEN,
  })
  status: TaskStatus;

  // 需要额外定义关联字段
  @Column()
  userId: string;

  // 虽然能在表中生成userId，但是在代码中只负责关联对象的类型；
  @ManyToOne(() => User, (user) => user.tasks, { nullable: false })
  user: User;

  @OneToMany(() => TaskLabel, (label) => label.task, {
    // it's not recommended to use it.❌❌
    cascade: true,
  })
  labels: TaskLabel[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
