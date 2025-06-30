const express = require('express');
const router = express.Router();
const { getLeaderboard } = require('../controllers/leaderboard.controller');
const { updateUserScore } = require('../controllers/leaderboard.controller');
const { verifyToken } = require('../middleware/auth.middleware');

// Public: Get leaderboard
router.get('/', getLeaderboard);

// Manually trigger updateUserScore for the current user
router.post('/update-score', verifyToken, async (req, res) => {
  try {
    await updateUserScore(req.user.userId || req.user._id);
    res.json({ message: 'Score and rewards updated.' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating score', error: error.message });
  }
});

module.exports = router; 