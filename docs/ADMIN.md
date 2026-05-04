# Admin Module

Full CRUD on questions plus bulk import. All endpoints require a valid JWT with `role: "admin"`.

---

## Files

| File | Role |
|------|------|
| `routes/admin.routes.js` | Applies auth + admin middleware to all routes, defines endpoints |
| `controllers/admin.controller.js` | Business logic for all six endpoints |
| `middleware/auth.middleware.js` | Verifies JWT, attaches req.user |
| `middleware/admin.middleware.js` | Checks req.user.role === "admin" |
| `models/Question.js` | Question schema |

---

## Auth

All requests must include:
```
Authorization: Bearer <token>
```

Requests without a valid admin token get rejected before hitting any controller:
- No token or bad token -> 401 from auth middleware
- Valid token but not admin -> 403 from admin middleware

---

## Endpoints

### GET `/api/admin/questions`

Returns all questions including inactive ones (unlike the player endpoint which only returns active).

**Success `200`**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a...",
      "text": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"],
      "correctIndex": 1,
      "active": true,
      "createdAt": "..."
    }
  ]
}
```

Sorted by `createdAt` descending (newest first).

---

### POST `/api/admin/questions`

Create a single question.

**Request body**
```json
{
  "text": "What is the capital of France?",
  "options": ["Berlin", "Madrid", "Paris", "Rome"],
  "correctIndex": 2
}
```

**Success `201`**
```json
{
  "success": true,
  "data": { "_id": "...", "text": "...", "options": [...], "correctIndex": 2, "active": true }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 400 | Missing text, options not an array of exactly 4, or missing correctIndex |

---

### PUT `/api/admin/questions/:id`

Update an existing question. Send only the fields you want to change.

**Request body** (all fields optional)
```json
{
  "text": "Updated question text",
  "options": ["A", "B", "C", "D"],
  "correctIndex": 0
}
```

**Success `200`**
```json
{
  "success": true,
  "data": { ...updatedQuestion }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 400 | options provided but not exactly 4 items |
| 404 | Question not found |

**Notes**
- Uses `{ new: true, runValidators: true }` so the model-level 4-option validation still fires on update

---

### DELETE `/api/admin/questions/:id`

Permanently delete a question.

**Success `200`**
```json
{
  "success": true,
  "data": null
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 404 | Question not found |

---

### PATCH `/api/admin/questions/:id/toggle`

Flip the `active` status of a question. Active questions appear in player quizzes, inactive ones don't.

**Success `200`**
```json
{
  "success": true,
  "data": { ...question, "active": false }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 404 | Question not found |

**Notes**
- Uses fetch-then-save instead of `findByIdAndUpdate` so Mongoose validators still run

---

### POST `/api/admin/questions/bulk`

Import multiple questions at once from a JSON array.

**Request body**
```json
{
  "questions": [
    {
      "text": "Question one",
      "options": ["A", "B", "C", "D"],
      "correctIndex": 0
    },
    {
      "text": "Question two",
      "options": ["W", "X", "Y", "Z"],
      "correctIndex": 3
    }
  ]
}
```

**Success `201`**
```json
{
  "success": true,
  "data": [ ...insertedQuestions ]
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 400 | questions is not an array or is empty |
| 400 | One or more questions fail validation (returns array of bad indices) |

**Error example**
```json
{
  "success": false,
  "error": "2 question(s) failed validation",
  "data": [1, 3]
}
```

**Notes**
- The entire batch is validated before any DB writes, so it's all-or-nothing
- All imported questions default to `active: true`
- Bad indices are returned so the admin knows exactly which items to fix
