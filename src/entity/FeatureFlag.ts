import { Entity, PrimaryGeneratedColumn, Column, ManyToMany } from 'typeorm';
import { Character } from './Character';

@Entity()
export class FeatureFlag {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(() => Character, character => character.featureFlags)
  characters: Character[];
}