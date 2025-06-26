import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { Character } from './entity/Character';

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Hello World endpoint with dummy data
app.get('/hello', (req: Request, res: Response) => {
  const dummyData = {
    message: 'Hello World',
    timestamp: new Date().toISOString(),
    data: {
      id: 1,
      name: 'Dummy User',
      status: 'active'
    }
  };
  
  res.json(dummyData);
});

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Node.js Express TypeScript Server with TypeORM is running!' });
});

// User endpoints
app.get('/users', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({ relations: ['characters'] });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = userRepository.create(req.body);
    const result = await userRepository.save(user);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Character endpoints
app.get('/characters', async (req: Request, res: Response) => {
  try {
    const characterRepository = AppDataSource.getRepository(Character);
    const characters = await characterRepository.find({ relations: ['user'] });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

app.post('/characters', async (req: Request, res: Response) => {
  try {
    const characterRepository = AppDataSource.getRepository(Character);
    const character = characterRepository.create(req.body);
    const result = await characterRepository.save(character);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create character' });
  }
});

// Initialize database connection and start server
AppDataSource.initialize().then(() => {
  console.log('Data Source has been initialized!');
  
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
    console.log(`Hello World endpoint available at: http://localhost:${port}/hello`);
    console.log(`Users endpoint available at: http://localhost:${port}/users`);
    console.log(`Characters endpoint available at: http://localhost:${port}/characters`);
  });
}).catch((err) => {
  console.error('Error during Data Source initialization:', err);
});

export default app;