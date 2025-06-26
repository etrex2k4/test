# Node.js Express TypeScript Project with TypeORM

A Node.js Express server written in TypeScript with TypeORM integration for MariaDB/MySQL database operations.

## Features

- Express.js web server
- TypeScript for type safety
- TypeORM for database operations
- MariaDB/MySQL database support
- User and Character entities with 1:N relationship

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm
- MariaDB or MySQL database

### Windows-Specific Setup

#### Prerequisites für Windows
1. **Node.js Installation:**
   - Laden Sie Node.js von [nodejs.org](https://nodejs.org/) herunter (LTS Version v20 oder höher)
   - Verwenden Sie den Windows Installer (.msi) für eine einfache Installation
   - Alternativ können Sie Node.js über Chocolatey installieren:
     ```cmd
     choco install nodejs
     ```
   - Oder über winget:
     ```cmd
     winget install OpenJS.NodeJS
     ```

2. **Git für Windows:**
   - Installieren Sie Git von [git-scm.com](https://git-scm.com/download/win)
   - Oder über Chocolatey: `choco install git`

3. **Datenbank Setup (MariaDB/MySQL):**
   - **Option 1 - XAMPP (empfohlen für Entwicklung):**
     - Laden Sie XAMPP von [apachefriends.org](https://www.apachefriends.org/) herunter
     - Installieren Sie XAMPP und starten Sie MySQL über das Control Panel
   - **Option 2 - MySQL Community Server:**
     - Laden Sie MySQL von [mysql.com](https://dev.mysql.com/downloads/mysql/) herunter
     - Verwenden Sie den Windows Installer
   - **Option 3 - MariaDB:**
     - Laden Sie MariaDB von [mariadb.org](https://mariadb.org/download/) herunter

4. **Terminal/Command Line:**
   - Verwenden Sie die Windows Command Prompt (cmd), PowerShell oder Git Bash
   - Für eine bessere Erfahrung wird Windows Terminal empfohlen

### Installation
```bash
npm install
```

#### Windows Installation Steps
1. **Projekt klonen:**
   ```cmd
   git clone https://github.com/etrex2k4/test.git
   cd test
   ```

2. **Dependencies installieren:**
   ```cmd
   npm install
   ```
   
   Bei Problemen mit Node-gyp unter Windows:
   ```cmd
   npm install --global windows-build-tools
   npm install
   ```

### Database Setup
1. Create a MariaDB/MySQL database named `test_db` (or customize in environment variables)
2. Copy `.env.example` to `.env` and update database credentials if needed
```bash
cp .env.example .env
```

#### Windows Database Setup
1. **Datenbank erstellen:**
   - Bei XAMPP: Öffnen Sie http://localhost/phpmyadmin und erstellen Sie eine Datenbank namens `test_db`
   - Bei MySQL Command Line:
     ```cmd
     mysql -u root -p
     CREATE DATABASE test_db;
     ```

2. **Environment-Datei erstellen:**
   ```cmd
   copy .env.example .env
   ```
   
   Alternativ in PowerShell:
   ```powershell
   Copy-Item .env.example .env
   ```

3. **Environment-Variablen anpassen:**
   Öffnen Sie die `.env` Datei mit einem Text-Editor (z.B. Notepad++) und passen Sie die Datenbankverbindung an:
   ```
   DB_HOST=localhost
   DB_PORT=3306
   DB_USERNAME=root
   DB_PASSWORD=ihr_passwort
   DB_DATABASE=test_db
   ```

### Development
Run the server in development mode with auto-reload:
```bash
npm run dev
```

#### Windows Development
1. **Development Server starten:**
   ```cmd
   npm run dev
   ```
   
   Oder in PowerShell:
   ```powershell
   npm run dev
   ```

2. **Server testen:**
   - Öffnen Sie http://localhost:3000 in Ihrem Browser
   - Sie sollten die Nachricht "Node.js Express TypeScript Server with TypeORM is running!" sehen

3. **API testen:**
   - Hello World Endpoint: http://localhost:3000/hello
   - Users Endpoint: http://localhost:3000/users

#### Windows Troubleshooting
- **Port bereits belegt:** Ändern Sie den PORT in der `.env` Datei
- **Datenbankverbindung fehlgeschlagen:** Überprüfen Sie, ob MySQL/MariaDB läuft
- **Permission Errors:** Führen Sie die Command Line als Administrator aus
- **Node.js nicht gefunden:** Starten Sie eine neue Command Line nach der Node.js Installation

### Production
Build and run the server:
```bash
npm run build
npm start
```

#### Windows Production Build
1. **TypeScript kompilieren:**
   ```cmd
   npm run build
   ```

2. **Production Server starten:**
   ```cmd
   npm start
   ```

3. **Als Windows Service ausführen (optional):**
   - Installieren Sie PM2: `npm install -g pm2`
   - Starten Sie mit PM2: `pm2 start dist/server.js --name "test-app"`

## Endpoints

### General
- `GET /` - Server status
- `GET /hello` - Returns "Hello World" with dummy data

### Users
- `GET /users` - Get all users with their characters
- `POST /users` - Create a new user

### Characters  
- `GET /characters` - Get all characters with their user
- `POST /characters` - Create a new character

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

#### Windows API Examples
Verwenden Sie diese Befehle in der Windows Command Prompt:

**Benutzer erstellen:**
```cmd
curl -X POST http://localhost:3000/users -H "Content-Type: application/json" -d "{\"name\": \"John Doe\", \"email\": \"john@example.com\"}"
```

**Charakter erstellen:**
```cmd
curl -X POST http://localhost:3000/characters -H "Content-Type: application/json" -d "{\"name\": \"Warrior\", \"level\": 10, \"characterClass\": \"Fighter\", \"user\": {\"id\": 1}}"
```

**PowerShell Beispiele:**
```powershell
# Benutzer erstellen
Invoke-RestMethod -Uri "http://localhost:3000/users" -Method Post -ContentType "application/json" -Body '{"name": "John Doe", "email": "john@example.com"}'

# Charakter erstellen
Invoke-RestMethod -Uri "http://localhost:3000/characters" -Method Post -ContentType "application/json" -Body '{"name": "Warrior", "level": 10, "characterClass": "Fighter", "user": {"id": 1}}'
```

**Alternative: Postman verwenden**
- Installieren Sie Postman von [postman.com](https://www.postman.com/)
- Importieren Sie die API-Endpoints für einfache Tests

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

## Environment Variables

- `DB_HOST` - Database host (default: localhost)
- `DB_PORT` - Database port (default: 3306)
- `DB_USERNAME` - Database username (default: root)
- `DB_PASSWORD` - Database password (default: empty)
- `DB_DATABASE` - Database name (default: test_db)
- `PORT` - Server port (default: 3000)

The server runs on port 3000 by default.
