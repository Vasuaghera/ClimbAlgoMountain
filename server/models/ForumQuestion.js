const mongoose = require('mongoose');

const forumQuestionSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  createdAt: { type: Date, default: Date.now },
  answers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ForumAnswer' }],
  bestAnswer: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumAnswer', default: null },
});

const ForumQuestion = mongoose.model('ForumQuestion', forumQuestionSchema);
module.exports = ForumQuestion; 