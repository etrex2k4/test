import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Character } from './Character';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => Character, character => character.user)
  characters: Character[];
}