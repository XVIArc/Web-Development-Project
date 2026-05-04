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

---

## 🔐 Auth

- ✅ Register page (RHF + Zod)
- ✅ Login page (RHF + Zod)
- ✅ Logout clears token
- ✅ Wire Login/Register pages to real API
- 🔲 ProtectedRoute component

---

## 🎮 Quiz

- ✅ Questions display one at a time, answer locks after selection
- ✅ Final score screen
- ✅ Past attempts page
- ✅ Leaderboard page
- ✅ Wire quiz pages to real API

---

## 🛠️ Admin

- 🔲 Admin dashboard (question list, active/inactive)
- 🔲 Create question form (RHF + Zod)
- 🔲 Edit question form
- 🔲 Delete question (with confirmation)
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
- 🔲 Admin middleware enforced (stubbed)
- ✅ Configure Vite proxy to backend

---

## 🎯 Variation

- 🔲 Choose + get tutor sign-off
- 🔲 Implement in backend
- 🔲 Implement in frontend

---

## 📄 Docs & Submission

- 🔲 README: setup, architecture diagram, API docs
- 🔲 Individual reflection PDF
- 🔲 Final zip (no node_modules)
