# Test Project

A full-stack application with Node.js/Express backend and Angular frontend.

## Project Structure

```
├── backend/          # Node.js Express TypeScript API
├── frontend/         # Angular application
└── README.md         # This file
```

## Quick Setup

### Prerequisites

- Node.js (v18+)
- MariaDB/MySQL
- npm

### Database Setup

1. Install MariaDB:
   ```bash
   # Ubuntu/Debian
   sudo apt install mariadb-server
   
   # macOS
   brew install mariadb
   ```

2. Create database:
   ```bash
   sudo mysql -u root -p
   CREATE DATABASE test_db;
   CREATE USER 'testuser'@'localhost' IDENTIFIED BY 'password';
   GRANT ALL PRIVILEGES ON test_db.* TO 'testuser'@'localhost';
   FLUSH PRIVILEGES;
   EXIT;
   ```

### Backend Setup

```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your database credentials
npm run dev
```

Backend runs on http://localhost:3000

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

Frontend runs on http://localhost:4200

## Development

- Backend: `cd backend && npm run dev`
- Frontend: `cd frontend && npm start`
- Build Backend: `cd backend && npm run build`
- Build Frontend: `cd frontend && npm run build`

## Environment Variables

Copy `backend/.env.example` to `backend/.env` and configure:

```
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=testuser
DB_PASSWORD=password
DB_DATABASE=test_db
PORT=3000
```