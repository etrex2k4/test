# Node.js Express TypeScript Project

A simple Node.js Express server written in TypeScript with a Hello World endpoint.

## Getting Started

### Prerequisites
- Node.js (v20 or higher)
- npm

### Installation
```bash
npm install
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

- `GET /` - Server status
- `GET /hello` - Returns "Hello World" with dummy data

### Example Response from `/hello`:
```json
{
  "message": "Hello World",
  "timestamp": "2025-06-26T17:18:15.750Z",
  "data": {
    "id": 1,
    "name": "Dummy User",
    "status": "active"
  }
}
```

The server runs on port 3000 by default.
