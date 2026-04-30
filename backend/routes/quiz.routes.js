const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const auth = require('../middleware/auth.middleware');
const { getQuestions, submitQuiz, getLeaderboard, getMyAttempts } = require('../controllers/quiz.controller');

const submitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 min
  max: 5,
  message: { success: false, error: 'Too many submissions, slow down' },
});

router.get('/questions',  auth, getQuestions);
router.post('/submit',    auth, submitLimiter, submitQuiz);
router.get('/leaderboard', getLeaderboard);
router.get('/attempts',   auth, getMyAttempts);

module.exports = router;
