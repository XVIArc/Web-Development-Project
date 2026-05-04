# Quiz Module

Handles the core game flow: fetching questions, submitting answers, viewing the leaderboard and past attempts.

---

## Files

| File | Role |
|------|------|
| `routes/quiz.routes.js` | Defines the four endpoints, applies auth middleware and rate limiter |
| `controllers/quiz.controller.js` | Business logic for all four endpoints |
| `models/Question.js` | Question schema |
| `models/Score.js` | Attempt/score schema |

---

## Endpoints

All endpoints that require auth expect an `Authorization: Bearer <token>` header.

---

### GET `/api/quiz/questions`

Auth required.

Returns a shuffled subset of active questions. `correctIndex` is stripped before sending so the client never sees the answer.

**Success `200`**
```json
{
  "success": true,
  "data": [
    {
      "_id": "64a...",
      "text": "What is 2 + 2?",
      "options": ["3", "4", "5", "6"]
    }
  ]
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 401 | Missing or invalid token |
| 503 | Fewer than 6 active questions in the DB |
| 500 | Unexpected server error |

**Notes**
- Questions are shuffled using Fisher-Yates on every request so each attempt feels different
- Returns between 6 and 10 questions (always 10 if enough are active, otherwise whatever is available above 6)
- `correctIndex` is intentionally excluded from the response

---

### POST `/api/quiz/submit`

Auth required. Rate limited to 5 requests per minute per IP.

Submit the player's answers after completing a quiz. The server scores them, saves the attempt, and returns the result.

**Request body**
```json
{
  "answers": [
    { "questionId": "64a...", "selectedIndex": 1 },
    { "questionId": "64b...", "selectedIndex": 0 }
  ]
}
```

**Success `200`**
```json
{
  "success": true,
  "data": {
    "score": 1,
    "total": 2
  }
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 400 | Missing or empty answers array |
| 401 | Missing or invalid token |
| 429 | Rate limit hit |
| 500 | Unexpected server error |

**Notes**
- Scoring is +1 per correct answer, no negative marking
- All referenced questions are fetched in a single DB call
- The full answer list, score, total, userId, and username are saved to the Score collection
- Username is stored directly on the Score document (denormalised) so leaderboard reads don't need a populate

---

### GET `/api/quiz/leaderboard`

No auth required. Public endpoint.

Returns the top 10 scores across all users, sorted highest first.

**Success `200`**
```json
{
  "success": true,
  "data": [
    { "username": "alice", "score": 9, "total": 10, "createdAt": "..." },
    { "username": "bob",   "score": 7, "total": 10, "createdAt": "..." }
  ]
}
```

**Notes**
- Shows all attempts, not just best-per-user (every quiz submission can appear)
- Capped at 10 entries

---

### GET `/api/quiz/attempts`

Auth required.

Returns the current user's past quiz attempts, newest first.

**Success `200`**
```json
{
  "success": true,
  "data": [
    { "_id": "...", "score": 7, "total": 10, "createdAt": "..." }
  ]
}
```

**Errors**
| Status | Reason |
|--------|--------|
| 401 | Missing or invalid token |
| 500 | Unexpected server error |

---

## Question Model

```
text          String    required
options       [String]  required, must have exactly 4 items
correctIndex  Number    required, 0-3, index into options array
active        Boolean   default true, inactive questions are excluded from quiz fetches
```

---

## Score Model

```
userId    ObjectId  ref User, required
username  String    required (denormalised from JWT at submit time)
score     Number    required (total correct)
total     Number    required (total questions in that attempt)
answers   [{ questionId: ObjectId, selectedIndex: Number }]
createdAt DateTime  auto, from timestamps: true
```
