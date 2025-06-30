const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  topicId: { type: String, required: true },
  levels: [{
    level: { type: Number, required: true },
    completed: { type: Boolean, default: false },
    score: { type: Number, default: 0 },
    timeSpent: { type: Number, default: 0 },
    attempts: { type: Number, default: 0 },
    stars: { type: Number, default: 0, min: 0, max: 3 },
    completedAt: { type: Date }
  }],
  totalScore: { type: Number, default: 0 },
  highestLevel: { type: Number, default: 0 },
  lastPlayed: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

userProgressSchema.index({ userId: 1, topicId: 1 }, { unique: true });

const UserProgress = mongoose.model('UserProgress', userProgressSchema);
module.exports = UserProgress; 