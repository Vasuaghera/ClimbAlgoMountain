const express = require('express');
const router = express.Router();
const forumController = require('../controllers/forum.controller');
const auth = require('../middleware/auth.middleware');

// Create a new question
router.post('/questions', auth.verifyToken, forumController.createQuestion);
// List all questions
router.get('/questions', forumController.listQuestions);
// Get a single question with answers
router.get('/questions/:id', forumController.getQuestion);
// Add an answer to a question
router.post('/questions/:id/answers', auth.verifyToken, forumController.addAnswer);
// Upvote or un-upvote an answer
router.post('/answers/:id/upvote', auth.verifyToken, forumController.upvoteAnswer);

module.exports = router; 