import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from './User';

@Entity()
export class Character {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  level: number;

  @Column({ nullable: true })
  characterClass: string;

  @ManyToOne(() => User, user => user.characters)
  user: User;
}