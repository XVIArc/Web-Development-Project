const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const { register, login } = require('../controllers/auth.controller');

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 10,
  message: { success: false, error: 'Too many login attempts, try again later' },
});

router.post('/register', register);
router.post('/login', loginLimiter, login);

module.exports = router;
