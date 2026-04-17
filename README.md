# Profiles API

Backend Wizards Stage 1 — Express + TypeScript + PostgreSQL

## Stack
- **Runtime**: Node.js + TypeScript
- **Framework**: Express
- **Database**: PostgreSQL via Prisma ORM
- **ID generation**: UUID v7

## Setup

```bash
# 1. Install dependencies
npm install

# 2. Copy env file and fill in your DATABASE_URL
cp .env.example .env

# 3. Push schema to DB and generate Prisma client
npm run db:push
npm run db:generate

# 4. Run dev server
npm run dev
```

## Deployment 

1. Deploy from GitHub
2. Set `PORT` env variable if needed (Railway sets it automatically)
3. Run `npm run db:migrate` as a deploy command

## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profiles` | Create a profile by name |
| GET | `/api/profiles` | Get all profiles (filterable) |
| GET | `/api/profiles/:id` | Get a single profile |
| DELETE | `/api/profiles/:id` | Delete a profile |

### Filters for GET /api/profiles
- `gender` — e.g. `?gender=male`
- `country_id` — e.g. `?country_id=NG`
- `age_group` — e.g. `?age_group=adult`

Query params are case-insensitive.

## Error Responses

All errors follow:
```json
{ "status": "error", "message": "..." }
```

| Code | Meaning |
|------|---------|
| 400 | Missing or empty name |
| 404 | Profile not found |
| 502 | External API returned invalid/null data |
| 500 | Internal server error |
