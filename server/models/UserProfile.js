const mongoose = require('mongoose');

const userProfileSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trim: true, minlength: 3 },
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    password: { type: String, required: true, minlength: 6 },
    avatar: String,
    level: { type: Number, default: 0 },
    
    // Premium access fields
    premiumAccess: [{ type: String, default: [] }], // Array of game IDs that user has premium access to
    
    // Payment fields
    paymentHistory: [{
        amount: Number,
        currency: { type: String, default: 'usd' },
        paymentMethod: String,
        paymentDate: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
        gameAccess: [String] // Which games this payment unlocked
    }],
    
    // Forgot password OTP fields
    resetPasswordOTP: { type: String },
    resetPasswordOTPExpires: { type: Date },
    
    // Rewards fields
    rewards: [{ type: String, default: [] }], // e.g., ['tt_kit', 'ipad', 'laptop']
    redeemedRewards: [{ type: String, default: [] }], // e.g., ['tt_kit']
    redeemedPoints: { type: Number, default: 0 }, // Total points spent on rewards
    // Streak fields
    lastActiveDate: { type: Date, default: null },
    currentStreak: { type: Number, default: 0 },
    bestStreak: { type: Number, default: 0 },
    completionRate: { type: Number, default: 0 }, // Percentage of daily goals completed
    weeklyActivity: [{ type: Boolean, default: [] }], // Array of 7 booleans for current week
    
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Remove any explicit .index() calls for email/username if present
// userProfileSchema.index({ email: 1 });
// userProfileSchema.index({ username: 1 });

userProfileSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Method to check if user has access to a specific game
userProfileSchema.methods.hasGameAccess = function(gameId) {
    if (this.premiumAccess.includes(gameId)) return true;
    if (this.premiumAccess.includes('bundle') && (gameId === 'binary-tree' || gameId === 'graph')) return true;
    return false;
};

// Method to add premium access to a game
userProfileSchema.methods.addGameAccess = function(gameId) {
    if (!this.premiumAccess.includes(gameId)) {
        this.premiumAccess.push(gameId);
    }
    return this.save();
};

// Method to remove premium access from a game
userProfileSchema.methods.removeGameAccess = function(gameId) {
    this.premiumAccess = this.premiumAccess.filter(game => game !== gameId);
    return this.save();
};

const UserProfile = mongoose.model('UserProfile', userProfileSchema);
module.exports = UserProfile; 