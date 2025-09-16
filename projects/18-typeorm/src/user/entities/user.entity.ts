import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({
  name: 'user_typeorm',
})
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    name: 'name',
    length: 50,
  })
  name: string;
}
