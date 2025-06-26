import 'reflect-metadata';
import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { AppDataSource } from './data-source';
import { User } from './entity/User';
import { Character } from './entity/Character';

const app = express();
const port = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware
app.use(cors());
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

// Authentication endpoints
app.post('/auth/register', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const userRepository = AppDataSource.getRepository(User);
    
    // Check if user already exists
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      return res.status(400).json({ error: 'User with this email already exists' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Create user
    const user = userRepository.create({
      name,
      email,
      password: hashedPassword
    });
    
    const savedUser = await userRepository.save(user);
    
    // Generate JWT token
    const token = jwt.sign(
      { userId: savedUser.id, email: savedUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = savedUser;
    res.status(201).json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

app.post('/auth/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email } });
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    res.json({ user: userWithoutPassword, token });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Middleware to verify JWT token
interface AuthenticatedRequest extends Request {
  user?: any;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired token' });
    }
    req.user = user;
    next();
  });
};

// User endpoints
app.get('/users', async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({ 
      relations: ['characters'],
      select: ['id', 'name', 'email', 'isActive'] // Exclude password
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

app.post('/users', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    const userRepository = AppDataSource.getRepository(User);
    
    // Hash password before saving
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = userRepository.create({
      ...req.body,
      password: hashedPassword
    });
    
    const result = await userRepository.save(user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = result as any;
    res.status(201).json(userWithoutPassword);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Character endpoints (protected)
app.get('/characters', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    const characterRepository = AppDataSource.getRepository(Character);
    const characters = await characterRepository.find({ relations: ['user'] });
    res.json(characters);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch characters' });
  }
});

app.post('/characters', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
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