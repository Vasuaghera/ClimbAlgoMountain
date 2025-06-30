const express = require('express');
console.log('User Progress Router loaded');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const UserProfile = require('../models/UserProfile');
const UserProgress = require('../models/UserProgress');
const { updateUserScore } = require('../controllers/leaderboard.controller');

// Save or update user progress
router.post('/save-progress', verifyToken, async (req, res) => {
    try {
        const { topicId, level, score, timeSpent } = req.body;
        const userId = req.user._id;

        // Find existing progress or create new
        let progress = await UserProgress.findOne({ userId, topicId });

        if (!progress) {
            // Create new progress document
            progress = new UserProgress({
                userId,
                topicId,
                levels: Array.from({ length: 10 }, (_, i) => ({
                    level: i + 1,
                    completed: false,
                    score: 0,
                    timeSpent: 0,
                    attempts: 0,
                    stars: 0
                }))
            });
        }

        // Check if this topic was already fully completed before this update
        const wasAlreadyCompleted = progress.levels.every(level => level.completed);

        // Update level progress
        const levelIndex = progress.levels.findIndex(l => l.level === level);
        if (levelIndex !== -1) {
            const levelData = progress.levels[levelIndex];
            // Update level data
            levelData.completed = true;
            levelData.score = Math.max(levelData.score, score); // Keep highest score
            levelData.timeSpent = timeSpent;
            levelData.attempts += 1;
            levelData.completedAt = new Date();
            // Calculate stars based on score and time
            const stars = calculateStars(score, timeSpent);
            levelData.stars = Math.max(levelData.stars, stars);
        }

        // Update overall progress
        progress.totalScore = progress.levels.reduce((sum, level) => sum + level.score, 0);
        progress.highestLevel = Math.max(progress.highestLevel, level);
        progress.lastPlayed = new Date();

        await progress.save();

        // Check if all 10 levels are completed for this topic
        const allLevelsCompleted = progress.levels.every(level => level.completed);
        
        console.log(`[Level Progression] Topic: ${topicId}, Level: ${level}, All levels completed: ${allLevelsCompleted}, Was already completed: ${wasAlreadyCompleted}`);
        
        // Only increase level if this is the first time completing all levels for this topic
        if (allLevelsCompleted && !wasAlreadyCompleted) {
            // Find the user profile and increase their level
            const userProfile = await UserProfile.findById(userId);
            if (userProfile) {
                const oldLevel = userProfile.level || 1;
                userProfile.level = oldLevel + 1;
                await userProfile.save();
                console.log(`[Level Progression] User ${userProfile.username} completed all levels for ${topicId}. Level increased from ${oldLevel} to ${userProfile.level}`);
            } else {
                console.log(`[Level Progression] User profile not found for userId: ${userId}`);
            }
        } else if (allLevelsCompleted && wasAlreadyCompleted) {
            console.log(`[Level Progression] Topic ${topicId} was already completed, skipping level increase`);
        }

        // Update leaderboard after saving progress
        await updateUserScore(userId);
        
        res.json({
            success: true,
            progress: {
                topicId: progress.topicId,
                levels: progress.levels,
                totalScore: progress.totalScore,
                highestLevel: progress.highestLevel,
                lastPlayed: progress.lastPlayed
            }
        });
    } catch (error) {
        console.error('Error saving progress:', error);
        res.status(500).json({ success: false, error: 'Failed to save progress' });
    }
});

// Get user's progress for a specific topic
router.get('/progress/:topicId', verifyToken, async (req, res) => {
    try {
        const { topicId } = req.params;
        const userId = req.user._id;

        const progress = await UserProgress.findOne({ userId, topicId });

        if (!progress) {
            return res.json({
                success: true,
                progress: {
                    topicId,
                    levels: Array.from({ length: 10 }, (_, i) => ({
                        level: i + 1,
                        completed: false,
                        score: 0,
                        timeSpent: 0,
                        attempts: 0,
                        stars: 0
                    })),
                    totalScore: 0,
                    highestLevel: 1,
                    lastPlayed: new Date()
                }
            });
        }

        res.json({
            success: true,
            progress: {
                topicId: progress.topicId,
                levels: progress.levels,
                totalScore: progress.totalScore,
                highestLevel: progress.highestLevel,
                lastPlayed: progress.lastPlayed
            }
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch progress' });
    }
});

// Get all progress for a user
router.get('/all-progress', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const allProgress = await UserProgress.find({ userId });
        
        // Get user profile to include current level
        const userProfile = await UserProfile.findById(userId);

        res.json({
            success: true,
            progress: allProgress.map(progress => ({
                topicId: progress.topicId,
                levels: progress.levels,
                totalScore: progress.totalScore,
                highestLevel: progress.highestLevel,
                lastPlayed: progress.lastPlayed
            })),
            userLevel: userProfile ? userProfile.level : 1
        });
    } catch (error) {
        console.error('Error fetching all progress:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch progress' });
    }
});

// Helper function to calculate stars based on score and time
function calculateStars(score, timeSpent) {
    if (score >= 15) return 3;
    if (score >= 12) return 2;
    if (score >= 10) return 1;
    return 0;
}

// Helper function to recalculate user level based on completed topics
async function recalculateUserLevel(userId) {
    try {
        // Get all progress for the user
        const allProgress = await UserProgress.find({ userId });
        
        // Count how many topics are fully completed (all 10 levels)
        const completedTopics = allProgress.filter(progress => 
            progress.levels.every(level => level.completed)
        ).length;
        
        // Update user level (start from level 0, add 1 for each completed topic)
        const newLevel = completedTopics;
        
        const userProfile = await UserProfile.findById(userId);
        if (userProfile && userProfile.level !== newLevel) {
            userProfile.level = newLevel;
            await userProfile.save();
            console.log(`[Level Recalculation] User ${userProfile.username} level updated to ${newLevel} based on ${completedTopics} completed topics`);
        }
        
        return newLevel;
    } catch (error) {
        console.error('Error recalculating user level:', error);
        throw error;
    }
}

// Route to recalculate user level (useful for fixing existing users)
router.post('/recalculate-level', verifyToken, async (req, res) => {
    try {
        const userId = req.user._id;
        const newLevel = await recalculateUserLevel(userId);
        
        res.json({
            success: true,
            message: 'User level recalculated successfully',
            newLevel: newLevel
        });
    } catch (error) {
        console.error('Error recalculating level:', error);
        res.status(500).json({ success: false, error: 'Failed to recalculate level' });
    }
});

module.exports = router; 