const UserProfile = require('../models/UserProfile');
const UserFriends = require('../models/UserFriends');

// Helper to get or create UserFriends doc
async function getOrCreateUserFriends(userId) {
  let uf = await UserFriends.findOne({ userId });
  if (!uf) {
    uf = new UserFriends({ userId, friends: [], friendRequests: [], sentRequests: [] });
    await uf.save();
  }
  return uf;
}

// Send a friend request
exports.sendFriendRequest = async (req, res) => {
  try {
    const { toUserId } = req.body;
    const fromUserId = req.user._id;
    if (toUserId === String(fromUserId)) {
      return res.status(400).json({ message: 'You cannot send a friend request to yourself.' });
    }
    const fromUserProfile = await UserProfile.findById(fromUserId);
    const toUserProfile = await UserProfile.findById(toUserId);
    if (!toUserProfile) return res.status(404).json({ message: 'User not found.' });
    const fromUser = await getOrCreateUserFriends(fromUserId);
    const toUser = await getOrCreateUserFriends(toUserId);
    if (fromUser.friends.includes(toUserId)) {
      return res.status(400).json({ message: 'You are already friends.' });
    }
    if (fromUser.sentRequests.includes(toUserId)) {
      return res.status(400).json({ message: 'Friend request already sent.' });
    }
    if (fromUser.friendRequests.includes(toUserId)) {
      return res.status(400).json({ message: 'You have a pending request from this user.' });
    }
    fromUser.sentRequests.push(toUserId);
    toUser.friendRequests.push(fromUserId);
    await fromUser.save();
    await toUser.save();
    res.json({ message: 'Friend request sent.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending friend request', error: error.message });
  }
};

// Accept a friend request
exports.acceptFriendRequest = async (req, res) => {
  try {
    const { fromUserId } = req.body;
    const toUserId = req.user._id;
    const toUser = await getOrCreateUserFriends(toUserId);
    const fromUser = await getOrCreateUserFriends(fromUserId);
    if (!fromUser) return res.status(404).json({ message: 'User not found.' });
    if (!toUser.friendRequests.includes(fromUserId)) {
      return res.status(400).json({ message: 'No friend request from this user.' });
    }
    // Add each other as friends
    toUser.friends.push(fromUserId);
    fromUser.friends.push(toUserId);
    // Remove requests
    toUser.friendRequests = toUser.friendRequests.filter(id => String(id) !== String(fromUserId));
    fromUser.sentRequests = fromUser.sentRequests.filter(id => String(id) !== String(toUserId));
    await toUser.save();
    await fromUser.save();
    res.json({ message: 'Friend request accepted.' });
  } catch (error) {
    res.status(500).json({ message: 'Error accepting friend request', error: error.message });
  }
};

// Reject or cancel a friend request
exports.rejectFriendRequest = async (req, res) => {
  try {
    const { fromUserId } = req.body;
    const toUserId = req.user._id;
    const toUser = await getOrCreateUserFriends(toUserId);
    const fromUser = await getOrCreateUserFriends(fromUserId);
    if (!fromUser) return res.status(404).json({ message: 'User not found.' });
    // Remove from requests
    toUser.friendRequests = toUser.friendRequests.filter(id => String(id) !== String(fromUserId));
    fromUser.sentRequests = fromUser.sentRequests.filter(id => String(id) !== String(toUserId));
    await toUser.save();
    await fromUser.save();
    res.json({ message: 'Friend request rejected/canceled.' });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting/canceling friend request', error: error.message });
  }
};

// List friends
exports.listFriends = async (req, res) => {
  try {
    const userFriends = await getOrCreateUserFriends(req.user._id);
    const friendsProfiles = await UserProfile.find({ _id: { $in: userFriends.friends } }, 'username avatar');
    res.json({ friends: friendsProfiles });
  } catch (error) {
    res.status(500).json({ message: 'Error listing friends', error: error.message });
  }
};

// List pending friend requests
exports.listRequests = async (req, res) => {
  try {
    const userFriends = await getOrCreateUserFriends(req.user._id);
    const requestsProfiles = await UserProfile.find({ _id: { $in: userFriends.friendRequests } }, 'username avatar');
    res.json({ friendRequests: requestsProfiles });
  } catch (error) {
    res.status(500).json({ message: 'Error listing friend requests', error: error.message });
  }
};

// Remove a friend
exports.removeFriend = async (req, res) => {
  try {
    const { friendUserId } = req.body;
    const userId = req.user._id;
    if (!friendUserId) {
      return res.status(400).json({ message: 'friendUserId is required' });
    }
    const userFriends = await getOrCreateUserFriends(userId);
    const friendFriends = await getOrCreateUserFriends(friendUserId);
    // Remove each other from friends lists
    userFriends.friends = userFriends.friends.filter(id => String(id) !== String(friendUserId));
    friendFriends.friends = friendFriends.friends.filter(id => String(id) !== String(userId));
    await userFriends.save();
    await friendFriends.save();
    res.json({ message: 'Friend removed successfully.' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing friend', error: error.message });
  }
}; 