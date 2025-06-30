const mongoose = require('mongoose');

const userFriendsSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile', required: true },
  friends: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }],
  friendRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }],
  sentRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: 'UserProfile' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

userFriendsSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

const UserFriends = mongoose.model('UserFriends', userFriendsSchema);
module.exports = UserFriends; 