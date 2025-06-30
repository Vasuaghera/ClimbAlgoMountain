const ForumQuestion = require('../models/ForumQuestion');
const ForumAnswer = require('../models/ForumAnswer');
const UserProfile = require('../models/UserProfile');

// Create a new question
exports.createQuestion = async (req, res) => {
  try {
    const { title, body } = req.body;
    const author = req.user._id;
    const question = new ForumQuestion({ title, body, author });
    await question.save();
    res.status(201).json({ message: 'Question created', question });
  } catch (error) {
    res.status(500).json({ message: 'Error creating question', error: error.message });
  }
};

// List all questions
exports.listQuestions = async (req, res) => {
  try {
    const questions = await ForumQuestion.find()
      .populate('author', 'username email')
      .sort({ createdAt: -1 });
    res.json({ questions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions', error: error.message });
  }
};

// Get a single question with answers
exports.getQuestion = async (req, res) => {
  try {
    const question = await ForumQuestion.findById(req.params.id)
      .populate('author', 'username email')
      .populate({
        path: 'answers',
        populate: { path: 'author', select: 'username email' },
        options: { sort: { createdAt: -1 } }
      });
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ question });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching question', error: error.message });
  }
};

// Add an answer to a question
exports.addAnswer = async (req, res) => {
  try {
    const { body } = req.body;
    const author = req.user._id;
    const questionId = req.params.id;
    const answer = new ForumAnswer({ body, author, question: questionId });
    await answer.save();
    // Add answer to question's answers array
    await ForumQuestion.findByIdAndUpdate(questionId, { $push: { answers: answer._id } });
    res.status(201).json({ message: 'Answer added', answer });
  } catch (error) {
    res.status(500).json({ message: 'Error adding answer', error: error.message });
  }
};

// Upvote or un-upvote an answer
exports.upvoteAnswer = async (req, res) => {
  try {
    const answerId = req.params.id;
    const userId = req.user._id.toString();
    const answer = await ForumAnswer.findById(answerId);
    if (!answer) return res.status(404).json({ message: 'Answer not found' });
    // Ensure all upvotes are strings
    answer.upvotes = answer.upvotes.map(uid => uid.toString());
    const hasUpvoted = answer.upvotes.includes(userId);
    if (hasUpvoted) {
      return res.json({ message: 'You have already upvoted this answer.', upvotes: answer.upvotes.length });
    } else {
      // Add upvote (only if not already present)
      answer.upvotes.push(userId);
      await answer.save();
      return res.json({ message: 'Upvoted', upvotes: answer.upvotes.length });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error upvoting answer', error: error.message });
  }
};

// Mark an answer as best answer (question author only)
exports.markBestAnswer = async (req, res) => {
  try {
    const { questionId, answerId } = req.params;
    const userId = req.user._id;
    const question = await ForumQuestion.findById(questionId);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    if (question.author.toString() !== userId) {
      return res.status(403).json({ message: 'Only the question author can mark the best answer.' });
    }
    question.bestAnswer = answerId;
    await question.save();
    res.json({ message: 'Best answer marked', bestAnswer: answerId });
  } catch (error) {
    res.status(500).json({ message: 'Error marking best answer', error: error.message });
  }
}; 