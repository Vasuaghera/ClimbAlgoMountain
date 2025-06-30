const UserProfile = require('../models/UserProfile');
const sendEmail = require('../utils/email');

const REWARD_TIERS = {
  tt_kit: { score: 250, label: 'TT Kit (Bottle, T-shirt, Book)' },
  ipad: { score: 500, label: 'iPad' },
  laptop: { score: 1000, label: 'Laptop' }
};

const redeemReward = async (req, res) => {
  try {
    console.log('Redeem reward request:', { userId: req.user._id, reward: req.body.reward });
    
    const user = await UserProfile.findById(req.user._id);
    const { reward } = req.body;
    
    if (!user) {
      console.log('User not found for ID:', req.user._id);
      return res.status(404).json({ message: 'User not found' });
    }
    
    console.log('User found:', { 
      userId: user._id, 
      rewards: user.rewards, 
      redeemedRewards: user.redeemedRewards,
      redeemedPoints: user.redeemedPoints 
    });
    
    if (!user.rewards || !user.rewards.includes(reward)) {
      console.log('Reward not unlocked:', reward);
      return res.status(400).json({ message: 'You have not unlocked this reward.' });
    }
    
    if (!user.redeemedRewards) {
      user.redeemedRewards = [];
    }
    
    if (user.redeemedRewards.includes(reward)) {
      console.log('Reward already redeemed:', reward);
      return res.status(400).json({ message: 'Reward already redeemed.' });
    }
    
    const tier = REWARD_TIERS[reward];
    if (!tier) {
      console.log('Invalid reward tier:', reward);
      return res.status(400).json({ message: 'Invalid reward.' });
    }
    
    // Calculate total score from UserProgress (for eligibility check only)
    const UserProgress = require('../models/UserProgress');
    const userProgress = await UserProgress.find({ userId: user._id });
    const totalScore = userProgress.reduce((sum, up) => sum + (up.totalScore || 0), 0);
    
    console.log('Score calculation:', { totalScore, redeemedPoints: user.redeemedPoints || 0 });
    
    // Check if user has enough available points (totalScore - redeemedPoints)
    const availablePoints = totalScore - (user.redeemedPoints || 0);
    if (availablePoints < tier.score) {
      console.log('Not enough points:', { availablePoints, required: tier.score });
      return res.status(400).json({ message: 'Not enough points to redeem this reward.' });
    }
    
    // Only increase redeemedPoints by the reward cost
    user.redeemedPoints = (user.redeemedPoints || 0) + tier.score;
    user.redeemedRewards.push(reward);
    await user.save();
    
    console.log('Reward redeemed successfully:', { reward, tier: tier.label });
    
    // Send email
    try {
      await sendEmail(user.email, {
        subject: 'Reward Redeemed!',
        message: `Congratulations! You have redeemed the reward: ${tier.label}. Our team will contact you soon for delivery.`,
        score: totalScore,
        rewards: user.rewards || [],
        action: 'reward'
      });
      console.log('Email sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Don't fail the entire request if email fails
    }
    
    res.json({ message: 'Reward redeemed and email sent!' });
  } catch (error) {
    console.error('Error in redeemReward:', error);
    res.status(500).json({ message: 'Error redeeming reward', error: error.message });
  }
};

module.exports = { redeemReward };