import axios from 'axios';
import React, { useState } from 'react';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API_URL = `${BACKEND_URL}/api`;

// Get auth token from localStorage
const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
};

export const gameProgressService = {
    // Save progress for a level
    async saveProgress(topicId, level, score, timeSpent) {
        try {
            const response = await axios.post(
                `${API_URL}/game-progress/save-progress`,
                {
                    topicId,
                    level,
                    score,
                    timeSpent,
                    completed: true // Explicitly set completed to true
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            
            // Dispatch custom event to notify components of progress update
            window.dispatchEvent(new CustomEvent('progressUpdated', {
                detail: { topicId, level, score, timeSpent }
            }));
            
            return response.data;
        } catch (error) {
            console.error('Error saving progress:', error);
            throw error;
        }
    },

    // Complete a level and update progress
    async completeLevel(topicId, level, score = 10, timeSpent = 0) {
        try {
            // First save the level progress
            const progressResponse = await this.saveProgress(topicId, level, score, timeSpent);
            
            // Then update the user's overall progress
            const userResponse = await axios.patch(
                `${API_URL}/users/profile`,
                {
                    progress: [{
                        topicId,
                        completed: true,
                        totalScore: score,
                        lastAccessed: new Date().toISOString(),
                        gameLevels: [{
                            level,
                            completed: true,
                            score,
                            timeSpent,
                            attempts: 1,
                            timestamp: new Date().toISOString()
                        }]
                    }]
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );

            // Dispatch custom event to notify components of level completion
            window.dispatchEvent(new CustomEvent('levelCompleted', {
                detail: { topicId, level, score, timeSpent }
            }));

            // Return both responses for the component to handle
            return {
                progress: progressResponse,
                user: userResponse.data
            };
        } catch (error) {
            console.error('Error completing level:', error);
            throw error;
        }
    },

    // Recalculate user level based on completed topics
    async recalculateLevel() {
        try {
            const response = await axios.post(
                `${API_URL}/game-progress/recalculate-level`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeader()
                    }
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error recalculating level:', error);
            throw error;
        }
    },

    // Get progress for a specific topic
    async getTopicProgress(topicId) {
        try {
            const response = await axios.get(
                `${API_URL}/game-progress/progress/${topicId}`,
                {
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching topic progress:', error);
            throw error;
        }
    },

    // Get all progress for the user
    async getAllProgress() {
        try {
            const response = await axios.get(
                `${API_URL}/game-progress/all-progress`,
                {
                    headers: getAuthHeader()
                }
            );
            return response.data;
        } catch (error) {
            console.error('Error fetching all progress:', error);
            throw error;
        }
    },

    // Calculate score based on level and performance
    calculateScore(level, timeSpent = 0, attempts = 1) {
        const baseScore = 10; // Base score for completing a level
        const timeBonus = Math.max(0, 60 - timeSpent); // Bonus for completing quickly (up to 60 seconds)
        const attemptPenalty = Math.min(attempts - 1, 5); // Penalty for multiple attempts
        
        return Math.max(baseScore + timeBonus - attemptPenalty, baseScore);
    }
};

// Custom hook for using game progress in components
export const useGameProgress = () => {
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const completeLevel = async (topicId, level, timeSpent = 0, attempts = 1) => {
        setLoading(true);
        try {
            const score = gameProgressService.calculateScore(level, timeSpent, attempts);
            const result = await gameProgressService.completeLevel(topicId, level, score, timeSpent);
            setProgress(result.progress);
            setError(null);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loadTopicProgress = async (topicId) => {
        setLoading(true);
        try {
            const result = await gameProgressService.getTopicProgress(topicId);
            setProgress(result.progress);
            setError(null);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const loadAllProgress = async () => {
        setLoading(true);
        try {
            const result = await gameProgressService.getAllProgress();
            setProgress(result.progress);
            setError(null);
            return result;
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    return {
        progress,
        loading,
        error,
        completeLevel,
        loadTopicProgress,
        loadAllProgress
    };
}; 