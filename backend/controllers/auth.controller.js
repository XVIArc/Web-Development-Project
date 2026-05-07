const User = require("../models/User");
const jwt = require("jsonwebtoken");

// puts id, username and role in the token so downstream middleware
// doesn't have to hit the DB again just to know who this person is
const signToken = (user) =>
  jwt.sign(
    { id: user._id, username: user.username, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res
        .status(400)
        .json({ success: false, error: "Username and password are required" });
    }

    const existing = await User.findOne({ username });
    if (existing) {
      return res
        .status(409)
        .json({ success: false, error: "Username already taken" });
    }

    // password gets hashed by the pre-save hook in User.js, nothing to do here
    const user = await User.create({ username, password });
    const token = signToken(user);

    res.status(201).json({ success: true, data: { token, role: user.role } });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
    try {
        const username = req.body.username?.trim();
        const password = req.body.password;

        if (!username || !password) {
            return res
                .status(400)
                .json({ success: false, error: "Username and password are required" });
        }

        const user = await User.findOne({ username });

        console.log("User found:", !!user);
        console.log("User role:", user?.role);
        console.log("Stored password starts with:", user?.password?.slice(0, 7));

        if (!user) {
            return res
                .status(401)
                .json({ success: false, error: "Invalid credentials" });
        }

        const isMatch = await user.comparePassword(password);

        console.log("Password match:", isMatch);

        if (!isMatch) {
            return res
                .status(401)
                .json({ success: false, error: "Invalid credentials" });
        }

        const token = signToken(user);

        return res.json({
            success: true,
            data: {
                token,
                role: user.role,
            },
        });
    } catch (err) {
        console.error("Login error:", err);
        return res.status(500).json({ success: false, error: err.message });
    }
};

module.exports = { register, login };
