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


## Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/profiles` | Create a profile by name |
| GET | `/api/profiles` | Get all profiles (filterable) |
| GET | `/api/profiles/:id` | Get a single profile |
| DELETE | `/api/profiles/:id` | Delete a profile |

---

### 1. Create a Profile
**POST** `/api/profiles`

Creates a new profile based on a name. The server queries external APIs to fetch demographic data (gender, age, country).

**Request:**
```bash
curl -X POST http://localhost:3000/api/profiles \
  -H "Content-Type: application/json" \
  -d '{"name": "John"}'
```

**Success Response (201 Created):**
```json
{
  "status": "success",
  "data": {
    "id": "01890a2b-3c4d-5e6f-7890-abcdef123456",
    "name": "john",
    "gender": "male",
    "gender_probability": 0.98,
    "sample_size": 1250,
    "age": 35,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85
  }
}
```

**If Profile Already Exists (200 OK):**
```json
{
  "status": "success",
  "message": "Profile already exists",
  "data": { ... }
}
```

---

### 2. Get All Profiles
**GET** `/api/profiles`

Retrieve all profiles with optional filtering.

**Request (without filters):**
```bash
curl http://localhost:3000/api/profiles
```

**Request (with filters):**
```bash
# Filter by gender
curl http://localhost:3000/api/profiles?gender=male

# Filter by country
curl http://localhost:3000/api/profiles?country_id=NG

# Filter by age group
curl http://localhost:3000/api/profiles?age_group=adult

# Combine multiple filters
curl http://localhost:3000/api/profiles?gender=female&country_id=GB&age_group=adult
```

**Available Filters:**
- `gender` — `male` or `female` (case-insensitive)
- `country_id` — ISO country code, e.g. `NG`, `US`, `GB` (case-insensitive)
- `age_group` — `child`, `adult`, `senior` (case-insensitive)

**Response (200 OK):**
```json
{
  "status": "success",
  "count": 2,
  "data": [
    {
      "id": "01890a2b-3c4d-5e6f-7890-abcdef123456",
      "name": "john",
      "gender": "male",
      "country_id": "US"
    },
    {
      "id": "01890a2c-3c4d-5e6f-7890-abcdef123457",
      "name": "jane",
      "gender": "female",
      "country_id": "NG"
    }
  ]
}
```

---

### 3. Get a Single Profile
**GET** `/api/profiles/:id`

Retrieve detailed information about a specific profile.

**Request:**
```bash
curl http://localhost:3000/api/profiles/01890a2b-3c4d-5e6f-7890-abcdef123456
```

**Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "id": "01890a2b-3c4d-5e6f-7890-abcdef123456",
    "name": "john",
    "gender": "male",
    "gender_probability": 0.98,
    "sample_size": 1250,
    "age": 35,
    "age_group": "adult",
    "country_id": "US",
    "country_probability": 0.85
  }
}
```

**Profile Not Found (404 Not Found):**
```json
{
  "status": "error",
  "message": "Profile not found"
}
```

---

### 4. Delete a Profile
**DELETE** `/api/profiles/:id`

Delete a profile by ID.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/profiles/01890a2b-3c4d-5e6f-7890-abcdef123456
```

**Response (204 No Content):**
- Empty body on success

**Profile Not Found (404 Not Found):**
```json
{
  "status": "error",
  "message": "Profile not found"
}
```

---

## Error Responses

All error responses follow this format:
```json
{ "status": "error", "message": "..." }
```

| Status Code | Meaning |
|-------------|---------|
| 400 | Missing or empty name |
| 404 | Profile not found |
| 422 | Name must be a string |
| 502 | External API returned invalid/null data |
| 500 | Internal server error |
