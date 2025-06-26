# Backend - Node.js Express TypeScript API

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Configure environment:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## API Endpoints

- `GET /` - Health check
- `GET /hello` - Test endpoint with dummy data
- `POST /auth/login` - User authentication
- `POST /auth/register` - User registration
- `GET /users` - Get all users
- `POST /users` - Create user
- `GET /characters` - Get characters (authenticated)
- `POST /characters` - Create character (authenticated)

Server runs on http://localhost:3000