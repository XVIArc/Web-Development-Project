# Project Backlog

> Status: 🔲 Todo · 🔄 In Progress · ✅ Done

---

## 🏗️ Backend

- ✅ server.js, db.js, .env.example
- ✅ Models: User, Question, Score
- ✅ Routes: auth, quiz, admin (with rate limiting)
- ✅ Controllers: auth, quiz, admin
- ✅ Middleware: auth (JWT verify + attach req.user)
- ✅ Middleware: admin (role check)
- ✅ Add `isCorrect` to Score answers sub-doc
- ✅ Test suite (Jest + Supertest) — 41/41 passing
- ✅ Extracted app.js for testability

---

## 🔐 Auth

- ✅ Register page (RHF + Zod)
- ✅ Login page (RHF + Zod)
- ✅ Logout clears token
- ✅ Wire Login/Register pages to real API
- 🔲 ProtectedRoute component (redirect to /login if no token)

---

## 🎮 Quiz

- ✅ Questions display one at a time, answer locks after selection
- ✅ Final score screen
- ✅ Past attempts page
- ✅ Leaderboard page
- ✅ Wire quiz pages to real API
- 🔲 **[BUG]** Leaderboard returns top 3 attempts instead of top 3 unique users
- 🔲 **[BUG]** "My History" button on Result page navigates to `/attempts` instead of `/history` <!-- AI --> — same user can appear multiple times <!-- AI -->

---

## 🛠️ Admin

- 🔲 Admin dashboard (question list, active/inactive)
- 🔲 Create question form (RHF + Zod)
- 🔲 Edit question form (pre-filled)
- 🔲 Delete question (with confirmation dialog)
- 🔲 Toggle active/inactive
- 🔲 Bulk import (JSON textarea)
- 🔲 Register admin routes in App.jsx
- 🔲 Admin-only route guard

---

## 🎨 UI / UX

- ✅ MUI theme, dark mode (persisted in localStorage)
- ✅ Navbar with role-based links
- ✅ Loading spinners
- 🔲 Error messages / toast notifications
- 🔄 Responsive layout

---

## 🔒 Security

- ✅ Password hashing (bcrypt, pre-save hook)
- ✅ Rate limiting (login: 10/15min, submit: 5/1min)
- ✅ Consistent API envelope `{ success, data, error }`
- ✅ Admin middleware enforced on all admin routes
- ✅ Vite proxy configured (dev)

---

## 🎯 Variation

- 🔲 Choose one + get tutor sign-off by end of Week 9
- 🔲 Update model if needed
- 🔲 Implement in backend
- 🔲 Implement in frontend

---

## 📄 Docs & Submission

- ✅ Docs: AUTH.md, QUIZ.md, ADMIN.md, MIDDLEWARE.md, MODELS.md
- 🔲 README: setup instructions, architecture diagram, API docs link
- 🔲 Individual reflection PDF
- 🔲 Final zip (no node_modules)
