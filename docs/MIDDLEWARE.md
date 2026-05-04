# Middleware

Two middleware functions sit between the routes and controllers to handle authentication and authorization.

---

## auth.middleware.js

Verifies the JWT and attaches the decoded payload to `req.user`. Must run before any middleware or controller that needs to know who the user is.

**How it works**
1. Reads the `Authorization` header, expects `Bearer <token>`
2. Missing or malformed header -> 401
3. `jwt.verify()` with `JWT_SECRET` from `.env`
4. Invalid or expired token -> 401
5. Sets `req.user = { id, username, role }` and calls `next()`

**Used by**
- `quiz.routes.js` -> applied to `GET /questions`, `POST /submit`, `GET /attempts`
- `admin.routes.js` -> applied to all routes via `router.use(auth, admin)`

---

## admin.middleware.js

Checks that the authenticated user is an admin. Always runs after auth middleware since it reads `req.user`.

**How it works**
1. Reads `req.user.role` (set by auth middleware)
2. Not admin -> 403
3. Is admin -> calls `next()`

**Used by**
- `admin.routes.js` -> applied to all routes via `router.use(auth, admin)`

---

## Order matters

In `admin.routes.js` the chain is:
```
request -> auth middleware -> admin middleware -> controller
```

Auth runs first to verify the token and set `req.user`. Admin runs second to check the role. If you flip the order, admin middleware will crash trying to read `req.user` before it's set.
