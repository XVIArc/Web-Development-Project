/**
 * Seed default accounts + test questions.
 * Run with:  npm run seed
 *
 * Users:     player "user"/"user"  and  admin "admin"/"admin"
 * Questions: 10 general knowledge questions
 *
 * Anything that already exists is skipped — safe to run multiple times.
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User     = require("../models/User");
const Question = require("../models/Question");

// ─── Users ────────────────────────────────────────────────────────────────────
const USERS = [
  { username: "user",  password: "user",  role: "player" },
  { username: "admin", password: "admin", role: "admin"  },
];

// ─── Questions ────────────────────────────────────────────────────────────────
const QUESTIONS = [
  {
    text: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctIndex: 2,
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1,
  },
  {
    text: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: ["Charles Dickens", "Jane Austen", "William Shakespeare", "Mark Twain"],
    correctIndex: 2,
  },
  {
    text: "What is the chemical symbol for water?",
    options: ["O2", "H2O", "CO2", "NaCl"],
    correctIndex: 1,
  },
  {
    text: "Which country invented pizza?",
    options: ["France", "Greece", "Spain", "Italy"],
    correctIndex: 3,
  },
  {
    text: "What is 12 × 12?",
    options: ["132", "144", "156", "124"],
    correctIndex: 1,
  },
  {
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
  },
  {
    text: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctIndex: 2,
  },
  {
    text: "In which year did the first Moon landing occur?",
    options: ["1965", "1967", "1969", "1972"],
    correctIndex: 2,
  },
];

// ─── Seed ─────────────────────────────────────────────────────────────────────
async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to", process.env.MONGO_URI, "\n");

  // Users
  console.log("── Users ──");
  for (const { username, password, role } of USERS) {
    const existing = await User.findOne({ username });
    if (existing) {
      console.log(`  skip     "${username}" already exists (role: ${existing.role})`);
    } else {
      await User.create({ username, password, role });
      console.log(`  created  ${role} "${username}"`);
    }
  }

  // Questions — skip by exact text match
  console.log("\n── Questions ──");
  for (const q of QUESTIONS) {
    const existing = await Question.findOne({ text: q.text });
    if (existing) {
      console.log(`  skip     "${q.text.slice(0, 50)}"`);
    } else {
      await Question.create({ ...q, active: true });
      console.log(`  created  "${q.text.slice(0, 50)}"`);
    }
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
