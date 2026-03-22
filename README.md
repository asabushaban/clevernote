# Clevernote Local Setup

This project has two apps:
- Backend API on `http://localhost:5001`
- Frontend on `http://localhost:3000`

## Prerequisites

- Node `16.20.2` (see `.nvmrc`)
- npm `8+`
- Docker Desktop (recommended for PostgreSQL)

## 1) Use the correct Node/npm version

```bash
nvm install
nvm use
node -v
npm -v
```

## 2) Install dependencies

```bash
npm install
```

## 3) Create backend environment file

```bash
cp backend/.env.example backend/.env
```

## 4) Start PostgreSQL

```bash
docker compose up -d postgres
```

If you use a local PostgreSQL install instead of Docker, update `backend/.env` to match your local credentials.

## 5) Run database migrations and seed data

```bash
npm run db:migrate
npm run db:seed
```

## 6) Start the apps

Run backend:
```bash
npm run dev:backend
```

In a second terminal, run frontend:
```bash
npm run dev:frontend
```

## Common troubleshooting

- `ECONNREFUSED 127.0.0.1:5432`: PostgreSQL is not running.
- `lockfileVersion@2` warning: npm is too old; switch to Node 16 with npm 8+.
- Frontend cannot reach API: confirm backend is running on port `5001`.
