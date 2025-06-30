const mongoose = require('mongoose');

const leaderboardSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true, unique: true },
  username: { type: String, required: true },
  avatar: { type: String },
  score: { type: Number, default: 0 },
  rank: { type: Number, default: null },
  updatedAt: { type: Date, default: Date.now }
});

leaderboardSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const Leaderboard = mongoose.model('Leaderboard', leaderboardSchema);
module.exports = Leaderboard; 