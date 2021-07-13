## Tree/Graph Technical Challenge

### Requirements
* nodejs v16
* Docker

No hard requirement imposed via `.npmrc` but please be advised that this project has only been tested on the afore mentioned nodejs version.

## First-time Setup

### Data Import
```bash
# Navigate to the server directory
cd server

# Copy .env.example file to .env
cp .env.example .env

# Install dependencies
npm install

# Start MongoDB and Redis
docker-compose up -d

# Run the database seeding script (migration.js)
npm run migrate
```

### Install Dependencies
```bash
# If not already done, run the install command for both server and client.
npm install
```

## Running the Application

### How do I start/stop the database/redis?
```bash
# From within the server directory

# Start services
docker-compose up

# Stop services
docker-compose down
```

### How do I run the **Server** application for local development?
Before running the server API, please ensure the previous migration steps have been correctly followed. Once the database/redis services have been started, the API server may also be started.
```bash
# From within the server directory

# Start dev api server
npm run dev

# Listening on port 5000
```

### How do I run the **Client** application for local development?
```bash
# From within the client directory

# Start client dev server
npm start

# Local: http://localhost:3000
```

## Interesting Features

* **GET** `/api/graph` caches the aggregated data in Redis. All subsequent requests are served at a much lower latency.
* **POST** `/api/graph` breaks the cache.
* You can also seed the database using a random data sample. Just repeat the data migration steps, and make sure to clear Redis' cache after running the migration command.
```bash
# From within the server directory
npm run migrate:random

# While the api server is running, you can use CURL to clear the cache.
curl -X POST http://localhost:5000/api/graph
```
