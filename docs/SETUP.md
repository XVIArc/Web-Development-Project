# Setup Guide — Getting the App Running from Scratch

Follow these steps on a fresh machine. Should take under 10 minutes.

---

## Prerequisites

| Tool | Minimum version | Check |
|---|---|---|
| Node.js | 18 | `node --version` |
| npm | 9 | `npm --version` |
| MongoDB | 6 | `mongod --version` |

### Installing MongoDB locally

**macOS (Homebrew)**
```bash
brew tap mongodb/brew
brew install mongodb-community
brew services start mongodb-community
```

**Ubuntu / Debian**
```bash
sudo apt-get install -y gnupg curl
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list
sudo apt-get update && sudo apt-get install -y mongodb-org
sudo systemctl start mongod
```

**Windows**
Download and run the MSI installer from https://www.mongodb.com/try/download/community  
The installer can set it up as a Windows Service (runs automatically on boot).

**Using MongoDB Atlas instead (cloud, no local install)**  
Create a free cluster at https://cloud.mongodb.com, copy your connection string, and use it as `MONGO_URI` in Step 3 below.

---

## 1. Clone the repo

```bash
git clone <repo-url>
cd COMP4347_A2
```

---

## 2. Install dependencies

Run both installs in parallel to save time:

```bash
cd backend  && npm install
cd ../frontend && npm install
```

---

## 3. Configure environment variables

### Backend — `backend/.env`

```bash
cd backend
cp .env.example .env
```

Open `backend/.env` and set:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/quizgame   # or your Atlas URI
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
```

> **JWT_SECRET** — use anything long and random in dev.  
> For production generate one with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

### Frontend — `frontend/.env`

```bash
cd frontend
cp .env.example .env
```

Leave `VITE_API_URL` blank for local development — Vite's proxy (already
configured in `vite.config.js`) forwards all `/api` calls to `localhost:5000`
automatically. You only need to set it when deploying to a server:

```env
VITE_API_URL=          # blank = use Vite proxy (correct for local dev)
# VITE_API_URL=https://your-api.com/api   # set this for production builds
```

---

## 4. Seed the database

Creates the default accounts and 10 sample questions.
Safe to run multiple times — existing records are skipped.

```bash
cd backend
npm run seed
```

Expected output:
```
── Users ──
  created  player "user"
  created  admin "admin"

── Questions ──
  created  "What is the capital of Australia?"
  ... (10 total)
```

Default accounts:

| Username | Password | Role |
|---|---|---|
| `user` | `user` | Player |
| `admin` | `admin` | Admin |

---

## 5. Start the servers

Open **two terminals**:

**Terminal 1 — backend**
```bash
cd backend
npm run dev        # nodemon, restarts on file changes
# or: npm start    # plain node, no auto-restart
```
Runs on http://localhost:5000

**Terminal 2 — frontend**
```bash
cd frontend
npm run dev
```
Runs on http://localhost:5173

Open http://localhost:5173 in your browser.

---

## 6. Verify everything works

Quick smoke-test checklist:

- [ ] Home page loads
- [ ] Register a new account → redirects to home
- [ ] Login as `user` / `user` → "Start Quiz" button appears
- [ ] Play a quiz → reaches Result page
- [ ] Leaderboard shows scores
- [ ] History shows past attempts
- [ ] Login as `admin` / `admin` → "Admin" link appears in navbar
- [ ] Admin dashboard shows the 10 seeded questions
- [ ] Create a new question, edit it, toggle it, delete it

---

## 7. Run the test suite

The tests use a separate `quizgame-test` database and clean up after
themselves — they will not touch your development data.

```bash
cd backend
npm test
```

Expected: **41 tests, 0 failures**.

---

## Project structure

```
COMP4347_A2/
├── backend/
│   ├── config/          # db.js — Mongoose connection
│   ├── controllers/     # auth, quiz, admin — business logic
│   ├── middleware/       # auth.middleware.js, admin.middleware.js
│   ├── models/          # User, Question, Score (Mongoose schemas)
│   ├── routes/          # auth.routes.js, quiz.routes.js, admin.routes.js
│   ├── scripts/         # seed.js
│   ├── tests/           # Jest + Supertest test suites
│   ├── app.js           # Express app (no listen — for testability)
│   └── server.js        # Entry point — connects DB and starts server
│
├── frontend/
│   └── src/
│       ├── api/         # admin.js, auth.js, quiz.js — fetch wrappers
│       ├── components/  # Navbar.jsx, ProtectedRoute.jsx
│       ├── context/     # Auth, Quiz, Toast — providers + hooks
│       └── pages/
│           ├── admin/   # AdminDashboard, QuestionForm, BulkImport
│           ├── Home, Login, Register, Quiz, Result, History, Leaderboard
│
└── docs/
    ├── SETUP.md         # ← you are here
    ├── UI-GUIDE.md      # How to improve the UI
    ├── IMAGE-VARIATION.md  # How to add the image variation
    ├── AUTH.md, QUIZ.md, ADMIN.md, MIDDLEWARE.md, MODELS.md
```

---

## Common problems

### `MongoDB connection error: connect ECONNREFUSED`
MongoDB isn't running. Start it:
- macOS: `brew services start mongodb-community`
- Linux: `sudo systemctl start mongod`
- Windows: start the "MongoDB" service from Services or Task Manager

### `Error: JWT_SECRET is not defined`
You haven't created `backend/.env` — go back to Step 3.

### `VITE_API_URL` causes 404s on API calls
Leave `VITE_API_URL` blank in `frontend/.env` for local dev. The Vite proxy
handles it. Only set it for production deployments.

### Port already in use (EADDRINUSE)
Something else is on port 5000 or 5173.  
Change `PORT` in `backend/.env`, or kill the process:
```bash
# Find what's on port 5000
lsof -i :5000        # macOS / Linux
netstat -ano | findstr :5000   # Windows
```

### `npm run seed` says "Authentication failed"
Your `MONGO_URI` in `backend/.env` has wrong credentials, or Atlas IP
whitelist doesn't include your machine.
