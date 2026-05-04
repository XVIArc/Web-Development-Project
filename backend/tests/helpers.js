const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Question = require("../models/Question");

// creates a user and mints a token directly — bypasses the login endpoint
// so the rate limiter doesn't interfere with tests
const createUser = async (username = "testuser", password = "password123", role = "player") => {
  const user = await User.create({ username, password, role });
  const token = jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
  return { token, userId: user._id, username };
};

const createAdmin = () => createUser("adminuser", "password123", "admin");

// creates n active questions, all with correctIndex: 0
const createQuestions = async (n = 6) => {
  const questions = Array.from({ length: n }, (_, i) => ({
    text: `Question ${i + 1}`,
    options: ["A", "B", "C", "D"],
    correctIndex: 0,
    active: true,
  }));
  return Question.insertMany(questions);
};

module.exports = { createUser, createAdmin, createQuestions };
