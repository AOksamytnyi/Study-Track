# Study Track

Study Track is a full-stack app for tracking study sessions, notes, tags, and learning progress.

## Tech Stack

- React, TypeScript, Vite
- Tailwind CSS
- TanStack Query and Zustand
- Express and TypeScript
- Prisma ORM
- PostgreSQL
- JWT authentication

## Project Structure

```text
Study_Track/
  client/   React application
  server/   Express API and Prisma schema
```

## Requirements

- Node.js
- npm
- PostgreSQL

## Setup

Install dependencies for both apps:

```bash
cd server
npm install

cd ../client
npm install
```

Create local environment files:

```bash
cp server/.env.example server/.env
cp client/.env.example client/.env
```

Update `server/.env` with your PostgreSQL connection string and JWT secret.

Generate the Prisma client:

```bash
cd server
npm run generate
```

Apply database migrations:

```bash
npx prisma migrate dev
```

## Development

Run the API:

```bash
cd server
npm run dev
```

Run the frontend:

```bash
cd client
npm run dev
```

By default, the API uses `http://localhost:3000`. The frontend should point to it through `VITE_API_URL`.

## Production Build

Build the frontend:

```bash
cd client
npm run build
```

Before deploying the API, make sure the production environment has `DATABASE_URL`, `JWT_SECRET`, and `PORT` configured.

For a deployed frontend, set `VITE_API_URL` to the API URL. For a deployed API, set `CLIENT_URL` to the frontend URL so CORS accepts requests from the correct origin.

Useful deployment commands:

```bash
npm --prefix server run migrate:deploy
npm --prefix server run start
```
