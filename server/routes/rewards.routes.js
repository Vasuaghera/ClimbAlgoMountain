const express = require('express');
const router = express.Router();
const { redeemReward } = require('../controllers/rewards.controller');
const { protect } = require('../middleware/auth.middleware');

// Test route to verify router is working
router.get('/test', (req, res) => {
  res.json({ message: 'Rewards router is working!' });
});

// Redeem a reward
router.post('/redeem', protect, redeemReward);

module.exports = router;