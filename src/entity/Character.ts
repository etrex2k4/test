import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';
import { FeatureFlag } from './FeatureFlag';

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

  @ManyToMany(() => FeatureFlag, featureFlag => featureFlag.characters)
  @JoinTable()
  featureFlags: FeatureFlag[];
}