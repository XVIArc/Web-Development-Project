# Data Models

Three Mongoose models required. All use `{ timestamps: true }`.

---

## User

File: `backend/models/User.js`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `username` | String | ✅ | unique, trim |
| `email` | String | ✅ | unique, lowercase |
| `password` | String | ✅ | hashed with bcrypt before save |
| `role` | String | — | `'user'` \| `'admin'`, default `'user'` |

**Notes:**
- Hash password in a `pre('save')` hook, not in the controller
- Add a `comparePassword(candidate)` instance method for login checks
- Never return `password` in API responses

---

## Question

File: `backend/models/Question.js`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `text` | String | ✅ | The question text |
| `options` | [String] | ✅ | Exactly 4 items — validate `v.length === 4` |
| `correctAnswer` | Number | ✅ | Index into `options` (0–3) |
| `active` | Boolean | — | Default `true`; admin can toggle |

**Variation fields (add when variation is decided):**
- Timed: `timeLimit: Number` (seconds)
- Categorised: `category: String`
- Image-based: `imageUrl: String`
- Review mode: `explanation: String`

---

## Score

File: `backend/models/Score.js`

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `userId` | ObjectId | ✅ | ref: `'User'` |
| `score` | Number | ✅ | Total correct answers |
| `answers` | [AnswerSchema] | ✅ | Full answer list — required by spec |

**AnswerSchema (sub-document, no `_id`):**

| Field | Type | Required | Notes |
|-------|------|----------|-------|
| `questionId` | ObjectId | ✅ | ref: `'Question'` |
| `selectedAnswer` | Number | ✅ | Index 0–3 of chosen option |
| `isCorrect` | Boolean | ✅ | Computed on submit, stored here |

**Notes:**
- `createdAt` (from timestamps) acts as the attempt timestamp
- Leaderboard: sort by `score` descending — show all attempts or best per user (document your choice in README)
- Use `.populate('userId', 'username')` when fetching leaderboard

---

## Relationships

```
User ──< Score >── Question
         (via answers[].questionId)
```

One user can have many Score documents (one per attempt).
Each Score embeds the full answer list referencing Questions.
