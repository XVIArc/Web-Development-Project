# Project Backlog

> Status: 🔲 Todo · 🔄 In Progress · ✅ Done

---

## 🏗️ Setup & Infrastructure

- ✅ Git repo initialised and pushed to Sydney Uni GitHub
- ✅ Project scaffold (backend + frontend folder structure)
- ✅ Backend boilerplate (server.js, db.js, .env.example)
- ✅ Models: User, Question, Score
- ✅ Controllers: auth, quiz, admin
- ✅ Routes: auth, quiz, admin
- ✅ Middleware: auth (JWT), admin (role check)
- ✅ Frontend API wrapper (fetch-based)
- ✅ React Context: AuthContext, QuizContext + useReducer
- 🔲 `npm install` backend dependencies
- 🔲 Init Vite React frontend (`npm create vite`)
- 🔲 Install frontend dependencies (MUI, RHF, Zod)
- 🔲 Configure Vite proxy to backend (avoid CORS in dev)
- 🔲 Create `.env` files from `.env.example`

---

## 🔐 Authentication

- 🔲 Register page (RHF + Zod validation)
- 🔲 Login page (RHF + Zod validation)
- 🔲 JWT stored in localStorage on login
- 🔲 Auth-protected routes (React Router `<ProtectedRoute>`)
- 🔲 Logout clears token + redirects
- 🔲 Admin login (same endpoint, role check on frontend)
- 🔲 Rate limiting on login endpoint ✅ (already in backend)

---

## 🎮 Quiz — Player Interface

- 🔲 Start quiz button → fetch questions from backend
- 🔲 Question display (text + 4 options)
- 🔲 Answer selection (locked after submit, no going back)
- 🔲 Next question flow
- 🔲 Questions shuffled per attempt ✅ (already in backend)
- 🔲 Final score screen
- 🔲 Submit quiz to backend (save attempt)
- 🔲 Rate limiting on submit endpoint ✅ (already in backend)
- 🔲 View past attempts page
- 🔲 Leaderboard page (sorted by score)

---

## 🛠️ Admin Interface

- 🔲 Admin-only route guard
- 🔲 Question list (all questions, active/inactive)
- 🔲 Create question form (RHF + Zod, 4 options, correct answer picker)
- 🔲 Edit question form
- 🔲 Delete question (with confirmation)
- 🔲 Toggle active/inactive status
- 🔲 Bulk import via JSON textarea (with validation feedback)

---

## 🎯 Game Mechanic Variation

> ⚠️ Must be decided and tutor-approved by end of Week 9

- 🔲 Choose one variation (timed / categorised / image-based / review mode)
- 🔲 Get tutor acknowledgement
- 🔲 Update Question model if needed (category field / image URL / explanation)
- 🔲 Implement variation in backend
- 🔲 Implement variation in frontend
- 🔲 Document variation in README

---

## 🎨 UI / UX

- 🔲 MUI theme setup (light + dark)
- 🔲 Dark mode toggle (persisted in localStorage)
- 🔲 Dark mode applies to both player and admin interfaces
- 🔲 Responsive layout (mobile-friendly)
- 🔲 Loading states / spinners
- 🔲 Error messages / toast notifications
- 🔲 Navigation bar (login/logout, links)

---

## 🔒 Security & Validation

- 🔲 Password hashing (bcrypt) ✅ (in User model)
- 🔲 Input sanitisation on backend (prevent XSS/injection)
- 🔲 Consistent API response envelope `{ success, data, error }` ✅
- 🔲 Admin middleware enforced on all admin routes ✅
- 🔲 Frontend hides admin UI for non-admins
- 🔲 Zod validation on all frontend forms

---

## 📄 Documentation

- 🔲 README: setup instructions
- 🔲 README: architecture diagram (Mermaid)
- 🔲 README: variation description + justification
- 🔲 README: team role breakdown + key commit links
- 🔲 API documentation (Swagger or Postman export)
- 🔲 Individual Contribution Reflections (one PDF per student)
  - Subsystem owned
  - Major technical challenge + solution
  - Mermaid/UML diagram for subsystem
  - Git commit analysis (12–15+ meaningful commits)
  - Reflection on variation design decisions

---

## 🧪 Testing & Polish

- 🔲 Manual end-to-end test (register → quiz → leaderboard)
- 🔲 Manual admin test (login → CRUD questions → bulk import)
- 🔲 Edge cases: empty question bank, duplicate usernames, wrong password
- 🔲 Final zip export (no node_modules)
- 🔲 Group coversheet (signed by all members)
- 🔲 Week 12 demo prep (each member owns one section)

---

## 🎁 Bonus (optional, up to +5 marks)

- 🔲 Exceptional UI/UX polish
- 🔲 Extra thoughtful features extending the variation
- 🔲 Strong error handling + user feedback throughout
