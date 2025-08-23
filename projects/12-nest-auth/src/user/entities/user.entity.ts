import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Permission } from './permission.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 50,
    comment: '用户名',
  })
  username: string;

  @Column({
    length: 50,
    comment: '密码',
  })
  password: string;

  // 手动配置
  //  @Column({
  //   type: 'timestamptz',           // 时间戳类型
  //   name: 'createTime',            // 数据库字段名
  //   nullable: false,               // NOT NULL
  //   default: () => 'CURRENT_TIMESTAMP', // DEFAULT now()
  //   comment: '创建时间'
  // })
  // use decorator
  @CreateDateColumn({
    comment: '创建时间',
  })
  createTime: Date;

  @UpdateDateColumn({
    comment: '更新时间',
  })
  updateTime: Date;

  @ManyToMany(() => Permission)
  @JoinTable({
    name: 'user_permission_relation',
  })
  permissions: Permission[];
}
