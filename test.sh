#!/bin/bash

# Simple test script to verify basic functionality
echo "Building the project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful"
else
    echo "❌ Build failed"
    exit 1
fi

echo "✅ TypeORM integration setup complete!"
echo ""
echo "To run the server with a MariaDB database:"
echo "1. Set up MariaDB/MySQL database"
echo "2. Copy .env.example to .env and configure database settings"
echo "3. Run: npm run dev"
echo ""
echo "Available endpoints:"
echo "- GET / (server status)"
echo "- GET /hello (hello world)"
echo "- GET /users (get all users)"
echo "- POST /users (create user)"
echo "- GET /characters (get all characters)"
echo "- POST /characters (create character)"