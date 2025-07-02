const express = require('express');
const router = express.Router();
const UserProfile = require('../models/UserProfile');
const { verifyToken } = require('../middleware/auth.middleware');
const { upload } = require('../config/cloudinary');
const friendsController = require('../controllers/friends.controller');

// Get user profile
router.get('/profile', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(404).json({ message: 'User not found' });
  }
  try {
    // Fetch the user from DB to ensure up-to-date data
    const user = await UserProfile.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // --- Streak logic (same as login) ---
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let streakUpdated = false;
    if (!user.lastActiveDate || user.currentStreak === 0) {
      user.currentStreak = 1;
      streakUpdated = true;
    } else {
      const lastActive = new Date(user.lastActiveDate);
      lastActive.setHours(0, 0, 0, 0);
      const diffDays = Math.floor((today - lastActive) / (1000 * 60 * 60 * 24));
      if (diffDays === 1) {
        user.currentStreak += 1;
        streakUpdated = true;
      } else if (diffDays > 1) {
        user.currentStreak = 1;
        streakUpdated = true;
      }
      // If diffDays === 0, do not update streak
    }
    if (user.currentStreak > user.bestStreak) {
      user.bestStreak = user.currentStreak;
      streakUpdated = true;
    }
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    if (!user.weeklyActivity || user.weeklyActivity.length === 0) {
      user.weeklyActivity = new Array(7).fill(false);
    }
    user.weeklyActivity[dayOfWeek] = true;
    const activeDaysThisWeek = user.weeklyActivity.filter(active => active).length;
    user.completionRate = Math.round((activeDaysThisWeek / 7) * 100);
    user.lastActiveDate = today;
    if (streakUpdated || !user.lastActiveDate || user.currentStreak === 0) await user.save();
    // --- End streak logic ---
    // Remove password field if present (should already be excluded)
    const userObj = user.toObject ? user.toObject() : user;
    delete userObj.password;
    res.json({ user: userObj });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

// Update user profile (with avatar upload support)
router.patch('/profile', verifyToken, upload.single('avatar'), async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ['username', 'email', 'avatar', 'level', 'premiumAccess'];
  const isValidOperation = updates.every(update => allowedUpdates.includes(update));

  if (!isValidOperation) {
    return res.status(400).json({ message: 'Invalid updates' });
  }

  try {
    const user = await UserProfile.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Store old username to check if it changed
    const oldUsername = user.username;

    // If avatar file is uploaded, update avatar field
    if (req.file) {
      user.avatar = req.file.path;
    }

    updates.forEach(update => {
      if (update !== 'avatar') {
        user[update] = req.body[update];
      }
    });
    await user.save();

    // If username changed, update the leaderboard entry
    if (oldUsername !== user.username) {
      try {
        const { updateLeaderboardUsername } = require('../controllers/leaderboard.controller');
        await updateLeaderboardUsername(user._id, user.username);
      } catch (leaderboardError) {
        console.error('Error updating leaderboard entry:', leaderboardError);
        // Don't fail the entire request if leaderboard update fails
      }
    }

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        level: user.level,
        premiumAccess: user.premiumAccess,
        redeemedPoints: user.redeemedPoints,
        currentStreak: user.currentStreak,
        bestStreak: user.bestStreak,
        completionRate: user.completionRate,
        weeklyActivity: user.weeklyActivity,
        lastActiveDate: user.lastActiveDate
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile', error: error.message });
  }
});

// User search endpoint for friend requests (returns basic profile info)
router.get('/search', verifyToken, async (req, res) => {
    const { username, userId } = req.query;
    if (userId) {
        const user = await UserProfile.findById(userId, 'username _id avatar email');
        return res.json({ users: user ? [user] : [] });
    }
    if (!username) return res.json({ users: [] });
    const users = await UserProfile.find({
      username: { $regex: username, $options: 'i' }
    }, 'username _id avatar email');
    res.json({ users });
});

// Friend system routes
router.post('/friends/request', verifyToken, friendsController.sendFriendRequest);
router.post('/friends/accept', verifyToken, friendsController.acceptFriendRequest);
router.post('/friends/reject', verifyToken, friendsController.rejectFriendRequest);
router.get('/friends', verifyToken, friendsController.listFriends);
router.get('/friend-requests', verifyToken, friendsController.listRequests);
router.post('/friends/remove', verifyToken, friendsController.removeFriend);

module.exports = router; 