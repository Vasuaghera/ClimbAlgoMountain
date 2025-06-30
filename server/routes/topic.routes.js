const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const Topic = require('../models/topic.model');

// Get all topics
router.get('/', verifyToken, async (req, res) => {
  try {
    const topics = await Topic.find();
    res.json(topics);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching topics', error: error.message });
  }
});

module.exports = router; 