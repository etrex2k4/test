# Node.js Express TypeScript Project with TypeORM

A Node.js Express server written in TypeScript with TypeORM integration for MariaDB/MySQL database operations.

## Features

- Express.js web server
- TypeScript for type safety
- TypeORM for database operations
- MariaDB/MySQL database support
- User and Character entities with 1:N relationship
- FeatureFlag system with many-to-many Character-FeatureFlag relationships
- Permission-based user management through feature flags
- Protected endpoints that require specific feature flags (e.g., "userverwaltung")

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm
- MariaDB or MySQL database

### Installation
```bash
npm install
```

### Database Setup
1. Create a MariaDB/MySQL database named `test_db` (or customize in environment variables)
2. Copy `.env.example` to `.env` and update database credentials if needed
```bash
cp .env.example .env
```

### Development
Run the server in development mode with auto-reload:
```bash
npm run dev
```

### Production
Build and run the server:
```bash
npm run build
npm start
```

## Endpoints

### General
- `GET /` - Server status
- `GET /hello` - Returns "Hello World" with dummy data

### Users
- `GET /users` - Get all users with their characters
- `POST /users` - Create a new user
- `PUT /users/:id/block` - Block a user (requires "userverwaltung" feature flag)
- `PUT /users/:id/unblock` - Unblock a user (requires "userverwaltung" feature flag)
- `DELETE /users/:id` - Delete a user (requires "userverwaltung" feature flag)

### Characters  
- `GET /characters` - Get all characters with their user and feature flags
- `POST /characters` - Create a new character
- `GET /characters/:id/featureflags` - Get feature flags for a specific character
- `POST /characters/:id/featureflags` - Add a feature flag to a character
- `DELETE /characters/:id/featureflags/:flagId` - Remove a feature flag from a character

### Feature Flags
- `GET /featureflags` - Get all feature flags with their characters
- `POST /featureflags` - Create a new feature flag

### Example Usage

Create a user:
```bash
curl -X POST http://localhost:3000/users \
  -H "Content-Type: application/json" \
  -d '{"name": "John Doe", "email": "john@example.com"}'
```

Create a character for a user:
```bash
curl -X POST http://localhost:3000/characters \
  -H "Content-Type: application/json" \
  -d '{"name": "Warrior", "level": 10, "characterClass": "Fighter", "user": {"id": 1}}'
```

Create a feature flag:
```bash
curl -X POST http://localhost:3000/featureflags \
  -H "Content-Type: application/json" \
  -d '{"name": "userverwaltung", "description": "User management permissions"}'
```

Add a feature flag to a character:
```bash
curl -X POST http://localhost:3000/characters/1/featureflags \
  -H "Content-Type: application/json" \
  -d '{"featureFlagId": 1}'
```

Block a user (requires character with "userverwaltung" feature flag):
```bash
curl -X PUT http://localhost:3000/users/2/block \
  -H "Content-Type: application/json" \
  -d '{"characterId": 1}'
```

Delete a user (requires character with "userverwaltung" feature flag):
```bash
curl -X DELETE http://localhost:3000/users/2 \
  -H "Content-Type: application/json" \
  -d '{"characterId": 1}'
```

## Database Schema

### User Table
- `id` (Primary Key, Auto-increment)
- `name` (String)
- `email` (String, Unique)
- `isActive` (Boolean, default: true)

### Character Table
- `id` (Primary Key, Auto-increment)
- `name` (String)
- `level` (Number, nullable)
- `characterClass` (String, nullable)
- `user` (Foreign Key to User)

### FeatureFlag Table
- `id` (Primary Key, Auto-increment)
- `name` (String, Unique)
- `description` (String, nullable)

### Character_FeatureFlag Junction Table
- `characterId` (Foreign Key to Character)
- `featureFlagId` (Foreign Key to FeatureFlag)

## Environment Variables

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_USERNAME` - Database username (default: root)
- `DB_PASSWORD` - Database password (default: empty)
- `DB_DATABASE` - Database name (default: test_db)
- `PORT` - Server port (default: 3000)

The server runs on port 3000 by default.
