import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response } from 'express';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { Character } from './entity/Character';
import { FeatureFlag } from './entity/FeatureFlag';

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
    const characters = await characterRepository.find({ relations: ['user', 'featureFlags'] });
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

// FeatureFlag endpoints
app.get('/featureflags', async (req: Request, res: Response) => {
  try {
    const featureFlagRepository = AppDataSource.getRepository(FeatureFlag);
    const featureFlags = await featureFlagRepository.find({ relations: ['characters'] });
    res.json(featureFlags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch feature flags' });
  }
});

app.post('/featureflags', async (req: Request, res: Response) => {
  try {
    const featureFlagRepository = AppDataSource.getRepository(FeatureFlag);
    const featureFlag = featureFlagRepository.create(req.body);
    const result = await featureFlagRepository.save(featureFlag);
    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create feature flag' });
  }
});

// Character FeatureFlag management endpoints
app.get('/characters/:id/featureflags', async (req: Request, res: Response) => {
  try {
    const characterRepository = AppDataSource.getRepository(Character);
    const character = await characterRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['featureFlags']
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    res.json(character.featureFlags);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch character feature flags' });
  }
});

app.post('/characters/:id/featureflags', async (req: Request, res: Response) => {
  try {
    const characterRepository = AppDataSource.getRepository(Character);
    const featureFlagRepository = AppDataSource.getRepository(FeatureFlag);
    
    const character = await characterRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['featureFlags']
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    const featureFlag = await featureFlagRepository.findOne({
      where: { id: req.body.featureFlagId }
    });
    
    if (!featureFlag) {
      return res.status(404).json({ error: 'Feature flag not found' });
    }
    
    // Check if character already has this feature flag
    if (character.featureFlags.some(ff => ff.id === featureFlag.id)) {
      return res.status(400).json({ error: 'Character already has this feature flag' });
    }
    
    character.featureFlags.push(featureFlag);
    await characterRepository.save(character);
    
    res.status(201).json({ message: 'Feature flag added to character', character });
  } catch (error) {
    res.status(500).json({ error: 'Failed to add feature flag to character' });
  }
});

app.delete('/characters/:id/featureflags/:flagId', async (req: Request, res: Response) => {
  try {
    const characterRepository = AppDataSource.getRepository(Character);
    
    const character = await characterRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['featureFlags']
    });
    
    if (!character) {
      return res.status(404).json({ error: 'Character not found' });
    }
    
    const flagId = parseInt(req.params.flagId);
    character.featureFlags = character.featureFlags.filter(ff => ff.id !== flagId);
    await characterRepository.save(character);
    
    res.json({ message: 'Feature flag removed from character' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to remove feature flag from character' });
  }
});

// Helper function to check if a character has a specific feature flag
async function hasFeatureFlag(characterId: number, flagName: string): Promise<boolean> {
  try {
    const characterRepository = AppDataSource.getRepository(Character);
    const character = await characterRepository.findOne({
      where: { id: characterId },
      relations: ['featureFlags']
    });
    
    if (!character) return false;
    
    return character.featureFlags.some(ff => ff.name === flagName);
  } catch (error) {
    return false;
  }
}

// User management endpoints (require 'userverwaltung' feature flag)
app.put('/users/:id/block', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.body;
    
    if (!characterId) {
      return res.status(400).json({ error: 'Character ID is required' });
    }
    
    // Check if character has user management feature flag
    if (!(await hasFeatureFlag(characterId, 'userverwaltung'))) {
      return res.status(403).json({ error: 'Character does not have user management permissions' });
    }
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isActive = false;
    await userRepository.save(user);
    
    res.json({ message: 'User blocked successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to block user' });
  }
});

app.put('/users/:id/unblock', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.body;
    
    if (!characterId) {
      return res.status(400).json({ error: 'Character ID is required' });
    }
    
    // Check if character has user management feature flag
    if (!(await hasFeatureFlag(characterId, 'userverwaltung'))) {
      return res.status(403).json({ error: 'Character does not have user management permissions' });
    }
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    user.isActive = true;
    await userRepository.save(user);
    
    res.json({ message: 'User unblocked successfully', user });
  } catch (error) {
    res.status(500).json({ error: 'Failed to unblock user' });
  }
});

app.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const { characterId } = req.body;
    
    if (!characterId) {
      return res.status(400).json({ error: 'Character ID is required' });
    }
    
    // Check if character has user management feature flag
    if (!(await hasFeatureFlag(characterId, 'userverwaltung'))) {
      return res.status(403).json({ error: 'Character does not have user management permissions' });
    }
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { id: parseInt(req.params.id) } });
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    
    await userRepository.remove(user);
    
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete user' });
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