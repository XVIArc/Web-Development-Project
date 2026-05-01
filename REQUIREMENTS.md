# Requirements Guide

A map of every assignment requirement to the files/endpoints that satisfy it.

---

## Pages Needed

### Player Side
| Page | Route | Notes |
|------|-------|-------|
| Register | `/register` | RHF + Zod form |
| Login | `/login` | RHF + Zod form |
| Home | `/` | Start quiz button, nav links |
| Quiz | `/quiz` | Questions one at a time, locked after answer |
| Result | `/result` | Final score after last question |
| Past Attempts | `/attempts` | User's previous quiz attempts |
| Leaderboard | `/leaderboard` | Top scores, public |

### Admin Side
| Page | Route | Notes |
|------|-------|-------|
| Admin Login | `/admin/login` | Or reuse `/login` with redirect |
| Admin Dashboard | `/admin` | Question list, active/inactive status |
| Create Question | `/admin/questions/new` | RHF + Zod, 4 options |
| Edit Question | `/admin/questions/:id` | Pre-filled form |
| Bulk Import | `/admin/import` | JSON textarea (can be modal on dashboard) |

---

## Endpoints Needed

### Auth — `/api/auth`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| POST | `/api/auth/register` | None | Register new user |
| POST | `/api/auth/login` | None | Login, returns JWT (rate limited: 10 req/15 min) |

### Quiz — `/api/quiz`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/quiz/questions` | User | Get shuffled questions (6–10) |
| POST | `/api/quiz/submit` | User | Submit answers, save attempt, return score (rate limited: 5 req/1 min) |
| GET | `/api/quiz/leaderboard` | None | Top scores |
| GET | `/api/quiz/attempts` | User | Current user's past attempts |

### Admin — `/api/admin`
| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/admin/questions` | Admin | List all questions |
| POST | `/api/admin/questions` | Admin | Create question |
| PUT | `/api/admin/questions/:id` | Admin | Edit question |
| DELETE | `/api/admin/questions/:id` | Admin | Delete question |
| PATCH | `/api/admin/questions/:id/toggle` | Admin | Toggle active/inactive |
| POST | `/api/admin/questions/bulk` | Admin | Bulk import JSON array |

All responses must use: `{ success: boolean, data?: any, error?: string }`

---

## Rubric → Implementation Map

### 1. Backend Architecture & APIs (25 marks)
| Requirement | File(s) |
|-------------|---------|
| Clear separation: routes / controllers / models | `routes/*.js`, `controllers/*.js`, `models/*.js` |
| RESTful design | All 12 endpoints |
| Consistent `{ success, data, error }` envelope | Every `res.json()` call |
| Variation correctly integrated in backend | Controller + model changes |

### 2. Frontend UI & UX (25 marks)
| Requirement | File(s) |
|-------------|---------|
| React Context + useReducer for quiz state | `context/QuizContext.jsx` |
| React Hook Form + Zod on all forms | Login, Register, question forms |
| Dark mode toggle persisted in localStorage | `App.jsx` theme setup |
| Intuitive flow matching approved variation | Quiz pages |

### 3. Quiz Logic & Mechanics (10 marks)
| Requirement | Where |
|-------------|-------|
| 6–10 questions per attempt | `quiz.controller.js` |
| Exactly 4 options, 1 correct answer | `Question` model validation |
| Questions shuffled per attempt | `quiz.controller.js` |
| Answer locked after submit | Frontend quiz state |
| +1 per correct, no negative marking | `quiz.controller.js` submit |
| Save attempt: userId, score, timestamp, full answers | `Score` model + submit controller |
| Leaderboard sorted highest first | `quiz.controller.js` leaderboard |
| Variation implemented exactly as approved | Backend + frontend |

### 4. Admin Interface & Access Control (10 marks)
| Requirement | Where |
|-------------|-------|
| Full CRUD on questions | `admin.controller.js` + admin pages |
| Bulk import via JSON textarea with validation | `POST /api/admin/questions/bulk` + admin UI |
| Admin middleware enforced on backend | `middleware/admin.middleware.js` |
| Admin UI hidden/blocked for regular users | `ProtectedRoute` + `AuthContext` |

### 5. Security & Validation (10 marks)
| Requirement | Where |
|-------------|-------|
| Password hashing | `User` model (bcrypt) |
| Rate limiting on login + submit | `auth.routes.js`, `quiz.routes.js` |
| Server-side input validation / XSS protection | All controllers |
| Consistent API envelope | All controllers |
| Zod validation on all frontend forms | All form components |

### 6. Individual Contribution Reflection (15 marks)
| Requirement | Where |
|-------------|-------|
| 1–2 page PDF per student | `docs/individual-reflections/` |
| Subsystem owned + implementation description | Written |
| Major technical challenge + code/commit evidence | Written |
| Mermaid or UML diagram for your subsystem | Written |
| 12–15+ meaningful commits with hashes + explanations | Your git log |
| Reflection on variation design decisions | Written |

### 7. Documentation (5 marks)
| Requirement | File |
|-------------|------|
| Setup instructions (env vars, install, run) | `README.md` |
| Architecture diagram (Mermaid or UML) | `README.md` |
| Variation description + justification | `README.md` |
| Team role breakdown + links to key commits | `README.md` |
| API documentation (Swagger or Postman export) | `README.md` or `docs/` |

---

## Game Mechanic Variation

> ⚠️ Choose one and get tutor sign-off by end of Week 9.
> Without a variation → Quiz Logic & Mechanics capped at Pass level.

| Option | What changes |
|--------|-------------|
| **Timed questions** | Per-question countdown timer; remaining time adds small bonus (max +1pt total) |
| **Categorised quizzes** | Users pick category first; add `category` field to Question model |
| **Image-based questions** | ≥50% of questions include an image URL; display with question |
| **Review mode** | After final score, show all questions with correct/incorrect + optional explanation field |

---

## Things That Will Cost You Marks

| Miss this | Penalty |
|-----------|---------|
| No variation implemented | Quiz Logic capped at Pass |
| Variation not tutor-approved by Week 9 | Deductions |
| Generic individual reflection (no commits/diagrams) | Heavily penalised |
| Fewer than 12–15 commits per person | Low individual mark |
| Admin routes not protected on backend | Security marks lost |
| Forms missing RHF + Zod | Frontend marks lost |
| Dark mode not persisted in localStorage | Frontend marks lost |
| Score model missing full answer list | Quiz Logic marks lost |
| `node_modules` included in zip submission | Submission issue |
| Not using Sydney Uni GitHub (github.sydney.edu.au) | Possible 0% contribution |
