/**
 * Seed default accounts + test questions.
 * Run with:  npm run seed
 *
 * Users:     player "user"/"user"  and  admin "admin"/"admin"
 * Questions: general knowledge (≥ 50% include imageUrl)
 *
 * By default, matches questions by exact `text` and syncs imageUrl from this file.
 * Set SEED_RESET_QUESTIONS=1 to delete ALL questions first, then insert fresh data:
 *   npm run seed:reset
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const mongoose = require("mongoose");
const User = require("../models/User");
const Question = require("../models/Question");

const USERS = [
  { username: "user", password: "user", role: "player" },
  { username: "admin", password: "admin", role: "admin" },
];

const QUESTIONS = [
  {
    text: "What is the capital of Australia?",
    options: ["Sydney", "Melbourne", "Canberra", "Brisbane"],
    correctIndex: 2,
    imageUrl: "https://picsum.photos/seed/australia-capital/800/400",
  },
  {
    text: "Which planet is known as the Red Planet?",
    options: ["Venus", "Mars", "Jupiter", "Saturn"],
    correctIndex: 1,
    imageUrl: "https://picsum.photos/seed/red-planet-mars/800/400",
  },
  {
    text: "How many sides does a hexagon have?",
    options: ["5", "6", "7", "8"],
    correctIndex: 1,
    imageUrl: "https://picsum.photos/seed/hexagon/800/400",
  },
  {
    text: "Who wrote 'Romeo and Juliet'?",
    options: [
      "Charles Dickens",
      "Jane Austen",
      "William Shakespeare",
      "Mark Twain",
    ],
    correctIndex: 2,
    imageUrl: "https://picsum.photos/seed/shakespeare/800/400",
  },
  {
    text: "What is the chemical symbol for water?",
    options: ["O2", "H2O", "CO2", "NaCl"],
    correctIndex: 1,
    imageUrl: "https://picsum.photos/seed/water-chemistry/800/400",
  },
  {
    text: "Which country invented pizza?",
    options: ["France", "Greece", "Spain", "Italy"],
    correctIndex: 3,
    imageUrl: "https://picsum.photos/seed/pizza/800/400",
  },
  {
    text: "What is 12 × 12?",
    options: ["132", "144", "156", "124"],
    correctIndex: 1,
    imageUrl: "https://picsum.photos/seed/math-144/800/400",
  },
  {
    text: "What is the largest ocean on Earth?",
    options: ["Atlantic", "Indian", "Arctic", "Pacific"],
    correctIndex: 3,
    imageUrl: "https://picsum.photos/seed/pacific-ocean/800/400",
  },
  {
    text: "Which gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Hydrogen"],
    correctIndex: 2,
    imageUrl: "https://picsum.photos/seed/plants-co2/800/400",
  },
  {
    text: "What planet is this?",
    options: ["Mercury", "Venus", "Earth", "Mars"],
    correctIndex: 2,
    imageUrl: "/images/Earth.jpg",
  },
  {
    text: "Which Brainrot character is this?",
    options: ["Skibidi", "Tralalero Tralala", "Brr Brr Patapim", "Tung Tung"],
    correctIndex: 1,
    imageUrl: "/images/Rot.jpg",
  },
  {
    text: "In which year did the first Moon landing occur?",
    options: ["1965", "1967", "1969", "1972"],
    correctIndex: 2,
    imageUrl: "https://picsum.photos/seed/moon-landing/800/400",
  },
];

/** Extra imageUrl fixes for questions already in the DB (e.g. from bulk import). */
const IMAGE_PATCHES = [
  {
    text: "What is the largest ocean on Earth?",
    imageUrl: "https://picsum.photos/seed/pacific-ocean/800/400",
  },
];

function normalizeImageUrl(url) {
  if (typeof url !== "string") return "";
  return url.trim();
}

async function upsertQuestion(q) {
  const imageUrl = normalizeImageUrl(q.imageUrl ?? "");
  const existing = await Question.findOne({ text: q.text });

  if (existing) {
    if (imageUrl && existing.imageUrl !== imageUrl) {
      existing.imageUrl = imageUrl;
      await existing.save();
      console.log(`  updated  "${q.text.slice(0, 55)}"`);
      return "updated";
    }
    console.log(`  skip     "${q.text.slice(0, 55)}"`);
    return "skip";
  }

  await Question.create({
    text: q.text,
    options: q.options,
    correctIndex: q.correctIndex,
    imageUrl,
    active: true,
  });
  console.log(`  created  "${q.text.slice(0, 55)}"`);
  return "created";
}

async function patchImagesByText() {
  console.log("\n── Image patches (existing questions) ──");
  for (const patch of IMAGE_PATCHES) {
    const imageUrl = normalizeImageUrl(patch.imageUrl);
    if (!imageUrl) continue;

    const doc = await Question.findOne({ text: patch.text });
    if (!doc) {
      console.log(`  missing  no question titled "${patch.text.slice(0, 55)}"`);
      continue;
    }
    if (doc.imageUrl === imageUrl) {
      console.log(`  skip     image already set for "${patch.text.slice(0, 55)}"`);
      continue;
    }
    doc.imageUrl = imageUrl;
    await doc.save();
    console.log(`  patched  imageUrl for "${patch.text.slice(0, 55)}"`);
  }
}

async function seed() {
  await mongoose.connect(process.env.MONGO_URI);
  console.log("Connected to", process.env.MONGO_URI, "\n");

  if (process.env.SEED_RESET_QUESTIONS === "1") {
    const { deletedCount } = await Question.deleteMany({});
    console.log(`Cleared ${deletedCount} existing question(s).\n`);
  }

  console.log("── Users ──");
  for (const { username, password, role } of USERS) {
    const existing = await User.findOne({ username });
    if (existing) {
      console.log(
        `  skip     "${username}" already exists (role: ${existing.role})`,
      );
    } else {
      await User.create({ username, password, role });
      console.log(`  created  ${role} "${username}"`);
    }
  }

  console.log("\n── Questions ──");
  let withImage = 0;
  for (const q of QUESTIONS) {
    if (normalizeImageUrl(q.imageUrl)) withImage += 1;
    await upsertQuestion(q);
  }

  await patchImagesByText();

  const total = await Question.countDocuments();
  const imageCount = await Question.countDocuments({
    imageUrl: { $exists: true, $nin: ["", null] },
  });
  const activeWithImage = await Question.countDocuments({
    active: true,
    imageUrl: { $exists: true, $nin: ["", null] },
  });

  console.log(
    `\nSeed file: ${withImage}/${QUESTIONS.length} questions define an imageUrl.`,
  );
  console.log(`Database: ${imageCount}/${total} questions have an imageUrl.`);
  console.log(
    `Active quiz pool: ${activeWithImage} question(s) with images (need ≥6 for a full quiz).`,
  );

  if (imageCount < total) {
    console.log(
      "\nTip: Some questions still have no image. Run `npm run seed` again after edits,",
    );
    console.log(
      "or use `npm run seed:reset` to replace all questions with the seed set.",
    );
  }

  await mongoose.disconnect();
  console.log("\nDone.");
}

seed().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
