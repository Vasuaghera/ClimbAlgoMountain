const UserProfile = require('../models/UserProfile');
const UserProgress = require('../models/UserProgress');
const Leaderboard = require('../models/Leaderboard');

// Utility function to update username in leaderboard
// This function should be called whenever a user updates their username
// to ensure the leaderboard reflects the new username immediately
exports.updateLeaderboardUsername = async (userId, newUsername) => {
  try {
    await Leaderboard.findOneAndUpdate(
      { userId },
      { 
        username: newUsername,
        updatedAt: new Date()
      },
      { new: true }
    );
    console.log('Leaderboard entry updated with new username:', newUsername);
    return true;
  } catch (error) {
    console.error('Error updating leaderboard entry:', error);
    return false;
  }
};

// Get leaderboard (top N users, from DB with rank)
exports.getLeaderboard = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const leaderboard = await Leaderboard.find()
      .sort({ score: -1 })
      .limit(limit)
      .lean();
    res.json({ success: true, leaderboard });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Error fetching leaderboard', error: error.message });
  }
};

// Update or insert a user's leaderboard entry
exports.updateUserScore = async (userId) => {
  console.log('[Leaderboard] updateUserScore called for userId:', userId);
  // Find user profile
  const user = await UserProfile.findById(userId);
  if (!user) {
    console.log('[Leaderboard] No user found for userId:', userId);
    return;
  }
  // Calculate total score from UserProgress
  const userProgress = await UserProgress.find({ userId });
  const totalScore = userProgress.reduce((sum, up) => sum + (up.totalScore || 0), 0);
  // Reward logic
  const rewardTiers = [
    { score: 250, reward: 'tt_kit' },
    { score: 500, reward: 'ipad' },
    { score: 1000, reward: 'laptop' }
  ];
  let rewardsUpdated = false;
  rewardTiers.forEach(tier => {
    if (totalScore >= tier.score && !user.rewards.includes(tier.reward)) {
      user.rewards.push(tier.reward);
      rewardsUpdated = true;
      console.log(`[Rewards] User ${user.username} unlocked reward: ${tier.reward}`);
    }
  });
  if (rewardsUpdated) {
    await user.save();
    console.log('User rewards after update:', user.rewards);
  }
  console.log('Total score for rewards:', totalScore);
  try {
    await Leaderboard.findOneAndUpdate(
      { userId },
      {
        userId,
        username: user.username,
        avatar: user.avatar,
        score: totalScore,
        updatedAt: new Date()
      },
      { upsert: true, new: true }
    );
    console.log('[Leaderboard] Successfully updated leaderboard for userId:', userId);
    // Auto-update all ranks after any score update
    const allEntries = await Leaderboard.find().sort({ score: -1 });
    for (let i = 0; i < allEntries.length; i++) {
      allEntries[i].rank = i + 1;
      await allEntries[i].save();
    }
    console.log('[Leaderboard] All ranks updated.');
  } catch (err) {
    console.error('[Leaderboard] Error updating leaderboard for userId:', userId, err);
  }
}; 