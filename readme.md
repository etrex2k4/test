# Node.js Express TypeScript Project with Angular Frontend

A full-stack application with a Node.js Express TypeScript backend and Angular Material frontend.

## Backend Features

- Express.js web server with TypeScript
- TypeORM for database operations
- MariaDB/MySQL database support
- JWT Authentication with bcrypt password hashing
- User and Character entities with 1:N relationship
- CORS enabled for frontend integration

## Frontend Features

- Angular 19 with TypeScript
- Angular Material Design components
- Google Fonts and Material Icons
- Responsive login/registration forms
- User dashboard
- JWT token-based authentication
- Form validation and error handling

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm
- MariaDB or MySQL database

### Backend Setup

1. Install backend dependencies:
```bash
npm install
```

2. Database Setup:
   - Create a MariaDB/MySQL database named `test_db` (or customize in environment variables)
   - Copy `.env.example` to `.env` and update database credentials if needed:
```bash
cp .env.example .env
```

3. Run the backend server:
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm run build
npm start
```

The backend server runs on http://localhost:3000

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd frontend
```

2. Install frontend dependencies:
```bash
npm install
```

3. Run the Angular development server:
```bash
ng serve
```

The frontend runs on http://localhost:4200

### Running the Full Application

1. Start the backend server (in the root directory):
```bash
npm run dev
```

2. Start the frontend server (in a new terminal, in the frontend directory):
```bash
cd frontend
ng serve
```

3. Open your browser and navigate to http://localhost:4200

## API Endpoints

### Authentication
- `POST /auth/register` - Register a new user
- `POST /auth/login` - Login user

### General
- `GET /` - Server status
- `GET /hello` - Returns "Hello World" with dummy data

### Users
- `GET /users` - Get all users with their characters
- `POST /users` - Create a new user

### Characters (Protected with JWT)
- `GET /characters` - Get all characters with their user
- `POST /characters` - Create a new character

## Database Schema

### User Table
- `id` (Primary Key, Auto-increment)
- `name` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `isActive` (Boolean, default: true)

### Character Table
- `id` (Primary Key, Auto-increment)
- `name` (String)
- `level` (Number, nullable)
- `characterClass` (String, nullable)
- `user` (Foreign Key to User)

## Environment Variables

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_USERNAME` - Database username (default: root)
- `DB_PASSWORD` - Database password (default: empty)
- `DB_DATABASE` - Database name (default: test_db)
- `PORT` - Server port (default: 3000)
- `JWT_SECRET` - JWT secret key for token signing

## Frontend Features

### Authentication
- **Login Page**: Email/password authentication with form validation
- **Register Page**: User registration with password confirmation
- **JWT Token Management**: Automatic token storage and API integration

### Dashboard
- **User Profile**: Display user information
- **Character Management**: Framework for character CRUD operations
- **Responsive Design**: Mobile-friendly Angular Material interface

### UI/UX
- **Material Design**: Modern, consistent UI components
- **Google Fonts**: Roboto font family
- **Material Icons**: Comprehensive icon set
- **Form Validation**: Real-time validation with error messages
- **Loading States**: Spinner indicators for async operations

## Technology Stack

### Backend
- Node.js + Express.js
- TypeScript
- TypeORM
- MariaDB/MySQL
- JWT + bcrypt
- CORS

### Frontend
- Angular 19
- Angular Material
- TypeScript
- RxJS
- SCSS
- Google Fonts & Material Icons

## Example Usage

### Register a new user:
```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com", "password": "password123"}'
```

### Login:
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "john@example.com", "password": "password123"}'
```

### Create a character (with JWT token):
```bash
curl -X POST http://localhost:3000/characters \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"name": "Warrior", "level": 10, "characterClass": "Fighter", "user": {"id": 1}}'
```
