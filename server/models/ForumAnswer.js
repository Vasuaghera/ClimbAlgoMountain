const mongoose = require('mongoose');

const forumAnswerSchema = new mongoose.Schema({
  body: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  createdAt: { type: Date, default: Date.now },
  question: { type: mongoose.Schema.Types.ObjectId, ref: 'ForumQuestion', required: true },
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }]
});

const ForumAnswer = mongoose.model('ForumAnswer', forumAnswerSchema);
module.exports = ForumAnswer; 