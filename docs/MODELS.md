# Data Models

Three Mongoose models. All use `{ timestamps: true }` so `createdAt` and `updatedAt` are added automatically.

---

## User

File: `backend/models/User.js`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `username` | String | yes | unique, trimmed |
| `password` | String | yes | stored as bcrypt hash |
| `role` | String | no | `"player"` or `"admin"`, defaults to `"player"` |

**Notes**
- Password is hashed in a `pre("save")` hook (10 rounds), never in the controller
- `comparePassword(candidate)` instance method wraps `bcrypt.compare`, used in login
- Password is never returned in any API response
- To make someone an admin, set `role: "admin"` directly in the DB

---

## Question

File: `backend/models/Question.js`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `text` | String | yes | The question prompt |
| `options` | [String] | yes | Exactly 4 items, validated at model level |
| `correctIndex` | Number | yes | Index into options (0-3) |
| `active` | Boolean | no | Defaults to true, inactive questions are excluded from player quizzes |

**Variation fields (add when variation is decided)**
- Timed: `timeLimit: Number` (seconds per question)
- Categorised: `category: String`
- Image-based: `imageUrl: String`
- Review mode: `explanation: String`

**Notes**
- `correctIndex` is never sent to the player client (stripped in quiz controller)
- Admin endpoints return `correctIndex` since admins need it for editing

---

## Score

File: `backend/models/Score.js`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userId` | ObjectId | yes | ref: User |
| `username` | String | yes | Denormalised from JWT at submit time |
| `score` | Number | yes | Total correct answers |
| `total` | Number | yes | Total questions in that attempt |
| `answers` | [AnswerSchema] | yes | Full answer list |

**AnswerSchema (sub-document)**

| Field | Type | Notes |
|-------|------|-------|
| `questionId` | ObjectId | ref: Question |
| `selectedIndex` | Number | Index 0-3 of the chosen option |
| `isCorrect` | Boolean | Computed at submit time, stored for review |

**Notes**
- `createdAt` from timestamps serves as the attempt timestamp
- `username` is stored directly so leaderboard reads don't need a `populate()`
- Each quiz attempt creates a new Score document, so one user can have many scores
- Leaderboard shows all attempts (not best-per-user), sorted by score descending

---

## Relationships

```
User ──< Score >── Question
         (via answers[].questionId)
```
