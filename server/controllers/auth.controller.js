const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const UserProfile = require('../models/UserProfile');
const { cloudinary } = require('../config/cloudinary');
const sendEmail = require('../utils/email');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const UserProgress = require('../models/UserProgress');

// Generate JWT token
const generateToken = (userId) => {
  const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_please_change_in_production';
  return jwt.sign(
    { userId },
    jwtSecret,
    { expiresIn: '7d' }
  );
};

// Register new user
const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await UserProfile.findOne({
      $or: [{ email }, { username }]
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists'
      });
    }

    // Hash password before saving
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Get today's date for streak initialization
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dayOfWeek = today.getDay();

    // Create new user profile with streak initialization
    const user = new UserProfile({
      username,
      email,
      password: hashedPassword,
      level: 0,
      currentStreak: 1,
      bestStreak: 1,
      lastActiveDate: today,
      completionRate: 14, // 1 day out of 7 = ~14%
      weeklyActivity: (() => {
        const week = new Array(7).fill(false);
        week[dayOfWeek] = true;
        return week;
      })()
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id);
    // Send welcome email
    await sendEmail(user.email, {
      subject: 'Welcome to DSA Game!',
      message: 'Thank you for registering at DSA Game!',
      score: 0,
      rewards: [],
      action: 'default'
    });
    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error registering user',
      error: error.message
    });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const { email, password } = req.body;

    // Find user
    const user = await UserProfile.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    // --- Streak logic ---
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
    
    // Update best streak if current streak is higher
    if (user.currentStreak > user.bestStreak) {
      user.bestStreak = user.currentStreak;
      streakUpdated = true;
    }
    
    // Update weekly activity (simplified - just mark today as active)
    const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
    if (!user.weeklyActivity || user.weeklyActivity.length === 0) {
      user.weeklyActivity = new Array(7).fill(false);
    }
    user.weeklyActivity[dayOfWeek] = true;
    
    // Calculate completion rate (simplified - based on weekly activity)
    const activeDaysThisWeek = user.weeklyActivity.filter(active => active).length;
    user.completionRate = Math.round((activeDaysThisWeek / 7) * 100);
    
    user.lastActiveDate = today;
    if (streakUpdated || !user.lastActiveDate || user.currentStreak === 0) await user.save();
    // --- End streak logic ---

    // Generate token
    const token = generateToken(user._id);
    // Send login alert email
    await sendEmail(user.email, {
      subject: 'Login Alert.',
      message: 'You have logged in to your DSA Game account.',
      action: 'default'
    });
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        user: {
          id: user._id,
          username: user.username,
          email: user.email
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error logging in',
      error: error.message
    });
  }
};

// Get user profile
const getProfile = async (req, res) => {
  try {
    const user = await UserProfile.findById(req.user.userId)
      .select('-password')
      .populate('progress.topicId', 'name description difficulty');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Calculate total score from UserProgress
    const userProgress = await UserProgress.find({ userId: user._id });
    let totalScore = 0;
    if (userProgress && userProgress.length > 0) {
      totalScore = userProgress.reduce((sum, up) => sum + (up.totalScore || 0), 0);
    }

    res.json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        level:user.level,
        profile: user.profile,
        progress: user.progress,
        achievements: user.achievements,
        savedProjects: user.savedProjects,
        role: user.role,
        score: totalScore
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: 'Error fetching profile', 
      error: error.message 
    });
  }
};

// Update user profile
const updateProfile = async (req, res) => {
  try {
    console.log('Update Profile Request:', {
      body: req.body,
      file: req.file
    });

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array()
      });
    }

    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'profile'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
      return res.status(400).json({
        success: false,
        message: 'Invalid updates'
      });
    }

    const user = await UserProfile.findById(req.user.userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Store old username to check if it changed
    const oldUsername = user.username;

    // Handle profile image upload
    if (req.file) {
      console.log('Processing file upload:', req.file);
      // If there's an existing profile image, delete it from Cloudinary
      if (user.profile?.avatar && user.profile.avatar.includes('cloudinary')) {
        const publicId = user.profile.avatar.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      // Update profile with new image URL
      user.profile = {
        ...user.profile,
        avatar: req.file.path
      };
    } else {
      // Handle other profile updates
      if (req.body.profile) {
        const profileData = typeof req.body.profile === 'string' ? JSON.parse(req.body.profile) : req.body.profile;
        user.profile = {
          ...user.profile,
          ...profileData
        };
      }
    }

    // Handle other updates
    updates.forEach(update => {
      if (update !== 'profile') {
        user[update] = req.body[update];
      }
    });

    await user.save();
    console.log('Profile updated successfully:', user.profile);

    // If username changed, update the leaderboard entry
    if (oldUsername !== user.username) {
      try {
        const { updateLeaderboardUsername } = require('./leaderboard.controller');
        await updateLeaderboardUsername(user._id, user.username);
      } catch (leaderboardError) {
        console.error('Error updating leaderboard entry:', leaderboardError);
        // Don't fail the entire request if leaderboard update fails
      }
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          profile: user.profile
        }
      }
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating profile',
      error: error.message
    });
  }
};

// Forgot Password: Send OTP
const forgotPassword = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    // Check for duplicate users
    const users = await UserProfile.find({ email });
    if (users.length > 1) {
      console.warn('WARNING: Duplicate users found for email:', email);
    }
    const user = users[0];
    if (!user) return res.status(404).json({ message: 'User not found' });
    // Cooldown: Only allow sending OTP if last one was sent more than 60 seconds ago
    if (user.resetPasswordOTPExpires && user.resetPasswordOTP) {
      const lastSent = new Date(user.resetPasswordOTPExpires.getTime() - 10 * 60 * 1000);
      if (Date.now() - lastSent.getTime() < 60 * 1000) {
        return res.status(429).json({ message: 'Please wait 60 seconds before requesting another OTP.' });
      }
    }
    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();
    // Confirm OTP is saved
    console.log('After save, user.resetPasswordOTP:', user.resetPasswordOTP, 'for email:', email);
    console.log('Generated OTP:', otp, 'for email:', email);
    await sendEmail(
      user.email,
      'Your Password Reset OTP',
      `Your OTP for resetting your DSA Game password is: <b style='font-size:1.5em;'>${otp}</b><br/><br/>This OTP is valid for 10 minutes. If you did not request a password reset, please ignore this email.`
    );
    res.json({ message: 'OTP sent to your email.' });
  } catch (error) {
    res.status(500).json({ message: 'Error sending OTP', error: error.message });
  }
};

// Verify OTP
const verifyOTP = async (req, res) => {
  try {
    const email = req.body.email.trim().toLowerCase();
    const otp = req.body.otp;
    console.log('Verifying OTP for email:', email);
    const user = await UserProfile.findOne({ email });
    // Debug log for OTP comparison
    console.log('Stored OTP:', user?.resetPasswordOTP, 'Submitted OTP:', otp);
    if (user && !user.resetPasswordOTP) {
      console.warn('User found but resetPasswordOTP is undefined:', user);
    }
    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    if (user.resetPasswordOTP !== otp || user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    res.json({ message: 'OTP verified.' });
  } catch (error) {
    res.status(500).json({ message: 'Error verifying OTP', error: error.message });
  }
};

// Reset Password
const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const user = await UserProfile.findOne({ email });
    if (!user || !user.resetPasswordOTP || !user.resetPasswordOTPExpires) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    if (user.resetPasswordOTP !== otp || user.resetPasswordOTPExpires < Date.now()) {
      return res.status(400).json({ message: 'Invalid or expired OTP.' });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    user.password = hashedPassword;
    user.resetPasswordOTP = undefined;
    user.resetPasswordOTPExpires = undefined;
    await user.save();
    res.json({ message: 'Password reset successful.' });
  } catch (error) {
    res.status(500).json({ message: 'Error resetting password', error: error.message });
  }
};

module.exports = {
  register,
  login,
  getProfile,
  updateProfile,
  forgotPassword,
  verifyOTP,
  resetPassword
}; 