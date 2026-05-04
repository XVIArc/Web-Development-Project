# Auth Module

Handles user registration and login. Returns a JWT on success which the client stores and sends with every subsequent request.

---

## Files

| File | Role |
|------|------|
| `routes/auth.routes.js` | Defines the two endpoints, applies rate limiter to login |
| `controllers/auth.controller.js` | Business logic for register and login |
| `models/User.js` | Mongoose schema, bcrypt pre-save hook, comparePassword method |

---

## Endpoints

### POST `/api/auth/register`

No auth required.

**Request body**
```json
{
  "username": "alice",
  "password": "hunter2"
}
```

**Success `201`**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "role": "player"
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 400 | Missing username or password |
| 409 | Username already taken |
| 500 | Unexpected server error |

---

### POST `/api/auth/login`

No auth required. Rate limited to 10 requests per 15 minutes per IP.

**Request body**
```json
{
  "username": "alice",
  "password": "hunter2"
}
```

**Success `200`**
```json
{
  "success": true,
  "data": {
    "token": "<jwt>",
    "role": "player"
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 400 | Missing username or password |
| 401 | Invalid credentials (deliberately vague, covers both wrong username and wrong password) |
| 429 | Rate limit hit |
| 500 | Unexpected server error |

---

## JWT Payload

```json
{
  "id": "<userId>",
  "username": "alice",
  "role": "player"
}
```

Expires in 7 days (set via `JWT_EXPIRES_IN` in `.env`). The `username` and `role` are embedded so downstream middleware doesn't need an extra DB lookup.

---

## User Model

```
username  String  required, unique, trimmed
password  String  required, hashed by pre-save hook (bcrypt, 10 rounds)
role      String  "player" | "admin", defaults to "player"
```

Password is never returned in any API response. The `comparePassword(candidate)` instance method wraps `bcrypt.compare` and is used in the login controller.

To create an admin user, set `role: "admin"` directly in the DB (no endpoint for this by design).
