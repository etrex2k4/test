import express, { Request, Response } from 'express';

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
  res.json({ message: 'Node.js Express TypeScript Server is running!' });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  console.log(`Hello World endpoint available at: http://localhost:${port}/hello`);
});

export default app;