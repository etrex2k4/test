import 'reflect-metadata';
import { DataSource } from 'typeorm';
import { User } from './entity/User';
import { Character } from './entity/Character';
import { FeatureFlag } from './entity/FeatureFlag';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306'),
  username: process.env.DB_USERNAME || 'root',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_DATABASE || 'test_db',
  synchronize: true, // In production, use migrations instead
  logging: false,
  entities: [User, Character, FeatureFlag],
  migrations: [],
  subscribers: [],
});