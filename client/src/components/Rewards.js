import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLoading } from '../hooks/useLoading';
import { DataLoading } from './Loading';
import axios from 'axios';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// DSA-themed decorative components
const ArrayDecoration = ({ position }) => (
  <div className={`absolute ${position} opacity-80 pointer-events-none`}>
    <div className="flex space-x-1">
      {[1, 2].map((item) => (
        <div key={item} className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
          {item}
        </div>
      ))}
    </div>
  </div>
);

const TreeDecoration = ({ position }) => (
  <div className={`absolute ${position} opacity-80 pointer-events-none`}>
    <div className="flex flex-col items-center space-y-1">
      <div className="w-6 h-6 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
        1
      </div>
      <div className="flex space-x-2">
        <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
          2
        </div>
        <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
          3
        </div>
      </div>
    </div>
  </div>
);

const LinkedListDecoration = ({ position }) => (
  <div className={`absolute ${position} opacity-80 pointer-events-none`}>
    <div className="flex items-center space-x-1">
      {[1, 2, 3].map((item, index) => (
        <div key={item} className="flex items-center">
          <div className="w-6 h-6 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-lg">
            {item}
          </div>
          {index < 2 && (
            <div className="w-3 h-0.5 bg-gradient-to-r from-orange-400 to-red-500 mx-1"></div>
          )}
        </div>
      ))}
    </div>
  </div>
);

const StackDecoration = ({ position }) => (
  <div className={`absolute ${position} opacity-80 pointer-events-none`}>
    <div className="flex flex-col-reverse space-y-reverse space-y-1">
      {[1, 2, 3].map((item) => (
        <div key={item} className="w-8 h-6 bg-gradient-to-br from-purple-400 to-pink-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
          {item}
        </div>
      ))}
    </div>
  </div>
);

const QueueDecoration = ({ position }) => (
  <div className={`absolute ${position} opacity-80 pointer-events-none`}>
    <div className="flex items-center space-x-1">
      {[1, 2, 3].map((item) => (
        <div key={item} className="w-6 h-8 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-lg">
          {item}
        </div>
      ))}
    </div>
  </div>
);

const Rewards = () => {
  const { user, refreshUserProfile } = useAuth();
  const { isLoading, withLoading } = useLoading();
  const [loadingReward, setLoadingReward] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Local state for fetched score
  const [fetchedScore, setFetchedScore] = useState(null);
  const [fetchingScore, setFetchingScore] = useState(true);
  const [fetchError, setFetchError] = useState('');

  useEffect(() => {
    const fetchTotalScore = async () => {
      setFetchingScore(true);
      setFetchError('');
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`${BACKEND_URL}/api/game-progress/all-progress`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });
        // Sum all progress.totalScore values
        const progressArr = res.data?.progress || [];
        const totalScore = progressArr.reduce((sum, p) => sum + (p.totalScore || 0), 0);
        setFetchedScore(totalScore);
      } catch (err) {
        setFetchError('Failed to fetch score. Please try again.');
        setFetchedScore(0);
      } finally {
        setFetchingScore(false);
      }
    };
    fetchTotalScore();
  }, []);

  // TEMP: Manual update score & rewards button for testing
  const [updating, setUpdating] = useState(false);
  const handleUpdateScore = async () => {
    await withLoading(async () => {
      setMessage('');
      const token = localStorage.getItem('token');
      const res = await axios.post(`${BACKEND_URL}/api/leaderboard/update-score`, 
        {},
        { 
          headers: { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          } 
        }
      );
      setMessage(res.data.message || 'Score and rewards updated!');
      await refreshUserProfile();
    }, 'Updating Score...');
  };

  const handleRedeem = async (reward) => {
    await withLoading(async () => {
      setMessage('');
      setError('');
      const token = localStorage.getItem('token');
      
      try {
        const res = await axios.post(`${BACKEND_URL}/api/rewards/redeem`, 
          { reward },
          { 
            headers: { 
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json'
            } 
          }
        );
        setMessage(res.data.message || 'Reward redeemed successfully!');
        await refreshUserProfile();
      } catch (err) {
        console.error('Reward redemption error:', err);
        
        // Handle specific error cases with user-friendly messages
        if (err.response?.status === 400) {
          const errorMessage = err.response.data.message;
          
          if (errorMessage.includes('not unlocked')) {
            setError('❌ This reward is not yet unlocked. Keep playing to earn more points!');
          } else if (errorMessage.includes('already redeemed')) {
            setError('✅ This reward has already been redeemed!');
          } else if (errorMessage.includes('Not enough points')) {
            setError('💰 Not enough points to redeem this reward. Continue playing to earn more points!');
          } else if (errorMessage.includes('Invalid reward')) {
            setError('⚠️ Invalid reward selected. Please try again.');
          } else {
            setError(`❌ ${errorMessage}`);
          }
        } else if (err.response?.status === 401) {
          setError('🔐 Please log in again to redeem rewards.');
        } else if (err.response?.status === 404) {
          setError('❌ User not found. Please log in again.');
        } else if (err.response?.status === 500) {
          setError('🚫 Server error. Please try again later.');
        } else {
          setError('❌ Failed to redeem reward. Please check your connection and try again.');
        }
      }
    }, 'Redeeming Reward...');
  };

  const isRedeemed = (reward) => user.redeemedRewards?.includes(reward);

  // Calculate available points and points needed for each reward
  const calculatePointsInfo = () => {
    const totalScore = fetchedScore ?? 0;
    const redeemedPoints = user.redeemedPoints || 0;
    const availablePoints = totalScore - redeemedPoints;
    return { totalScore, redeemedPoints, availablePoints };
  };

  const getPointsNeeded = (rewardId) => {
    const { availablePoints } = calculatePointsInfo();
    const reward = rewards.find(r => r.id === rewardId);
    if (!reward) return 0;
    return Math.max(0, reward.score - availablePoints);
  };

  const rewards = [
    {
      id: 'tt_kit',
      name: 'TT Kit',
      icon: '🎁',
      score: 250,
      description: 'Complete starter kit',
      items: ['Bottle', 'T-shirt', 'Book'],
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
      borderColor: 'border-blue-300 dark:border-blue-600'
    },
    {
      id: 'ipad',
      name: 'iPad',
      icon: '📱',
      score: 500,
      description: 'Premium tablet device',
      items: ['iPad Pro', 'Apple Pencil', 'Case'],
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-100 dark:bg-purple-900/30',
      borderColor: 'border-purple-300 dark:border-purple-600'
    },
    {
      id: 'laptop',
      name: 'Laptop',
      icon: '💻',
      score: 1000,
      description: 'Professional development machine',
      items: ['MacBook Pro', 'External Monitor', 'Keyboard'],
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
      borderColor: 'border-green-300 dark:border-green-600'
    }
  ];

  const unlockedRewards = user.rewards?.length || 0;
  const totalRewards = rewards.length;
  const redeemedRewards = user.redeemedRewards?.length || 0;

  return (
    <div className="min-h-screen bg-white font-mono relative overflow-hidden">
      {/* Loading Animation */}
      {(isLoading || fetchingScore) && <DataLoading />}
      
      {/* CSS Animation for gradient shift */}
      <style jsx>{`
        @keyframes gradientShift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .gradient-animate {
          background-size: 200% 200%;
          animation: gradientShift 6s ease infinite;
        }
      `}</style>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-green-200 via-green-100 via-green-50 to-white py-16 relative">
        {/* Decorative DSA elements */}
        <ArrayDecoration position="top-10 left-10" />
        <TreeDecoration position="top-20 right-20" />
        <LinkedListDecoration position="bottom-10 left-20" />
        <StackDecoration position="bottom-20 right-10" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-xl">
              <span className="text-3xl">🏆</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4 font-mono">
              Rewards Center
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Unlock amazing rewards as you master DSA concepts and climb the leaderboard
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 bg-white relative">
        {/* Decorative DSA elements */}
        <QueueDecoration position="top-10 left-10" />
        <ArrayDecoration position="top-20 right-20" />
        <TreeDecoration position="bottom-10 left-20" />
        <LinkedListDecoration position="bottom-20 right-10" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Stats Dashboard */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Current Score Card */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 hover:border-orange-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Current Score</p>
                  <p className="text-4xl font-bold text-orange-600">{fetchedScore ?? 0}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-orange-500 via-yellow-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">🎯</span>
                </div>
              </div>
            </div>
            {/* Unlocked, Redeemed, and Available Cards */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 hover:border-green-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Unlocked</p>
                  <p className="text-4xl font-bold text-green-600">{unlockedRewards}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">🔓</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 hover:border-blue-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Redeemed</p>
                  <p className="text-4xl font-bold text-blue-600">{redeemedRewards}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">✅</span>
                </div>
              </div>
            </div>
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 hover:border-purple-200 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm mb-2">Available</p>
                  <p className="text-4xl font-bold text-purple-600">{totalRewards}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
                  <span className="text-xl">🎯</span>
                </div>
              </div>
            </div>
          </div>

          {/* TEMP: Manual update button for testing */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-6 mb-8 hover:border-green-200 transition-all duration-300">
            
            <button
              className="px-8 py-4 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white rounded-2xl font-bold hover:from-orange-600 hover:via-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleUpdateScore}
              disabled={updating}
            >
              {updating ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                  Updating...
                </div>
              ) : (
                'Update Score & Rewards'
              )}
            </button>
          </div>

          {/* Success Message */}
          {message && (
            <div className="mb-8 p-6 bg-green-50 border-2 border-green-200 rounded-2xl">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-green-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="text-green-800 font-semibold text-lg">{message}</span>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zM8 7a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2zm6.293-11.293a1 1 0 011.414 0L19 7.586A8.001 8.001 0 0112 15a8.001 8.001 0 01-7.707-5.707l1.293-1.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-semibold text-lg">{error}</span>
              </div>
            </div>
          )}

          {/* Fetch Error Message */}
          {fetchError && (
            <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-2xl">
              <div className="flex items-center">
                <svg className="w-6 h-6 text-red-600 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm0-2a6 6 0 100-12 6 6 0 000 12zM8 7a1 1 0 100-2 1 1 0 000 2zm0 6a1 1 0 100-2 1 1 0 000 2zm6.293-11.293a1 1 0 011.414 0L19 7.586A8.001 8.001 0 0112 15a8.001 8.001 0 01-7.707-5.707l1.293-1.293z" clipRule="evenodd" />
                </svg>
                <span className="text-red-800 font-semibold text-lg">{fetchError}</span>
              </div>
            </div>
          )}

          {/* Rewards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {rewards.map((reward) => {
              const isUnlocked = user.rewards?.includes(reward.id);
              const isRedeemedReward = isRedeemed(reward.id);
              const pointsNeeded = getPointsNeeded(reward.id);
              const { availablePoints } = calculatePointsInfo();
              
              return (
                <div 
                  key={reward.id}
                  className="relative bg-white rounded-3xl border-2 border-gray-100 p-6 shadow-2xl transition-all duration-300 transform hover:scale-105 hover:shadow-3xl"
                >
                  {/* Status Badge */}
                  <div className="absolute -top-3 -right-3">
                    {isRedeemedReward ? (
                      <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        ✅ Redeemed
                      </div>
                    ) : isUnlocked ? (
                      <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        🔓 Unlocked
                      </div>
                    ) : (
                      <div className="bg-gradient-to-r from-gray-500 to-gray-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                        🔒 Locked
                      </div>
                    )}
                  </div>

                  {/* Reward Icon */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${reward.color} rounded-2xl mb-4 shadow-xl`}>
                      <span className="text-4xl">{reward.icon}</span>
                    </div>
                    <h3 className="text-gray-800 font-bold text-2xl mb-2">{reward.name}</h3>
                    <p className="text-gray-600 text-lg mb-4">{reward.description}</p>
                  </div>

                  {/* Score Requirement */}
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center space-x-3 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 px-6 py-3 rounded-2xl shadow-lg">
                      <span className="text-2xl">🎯</span>
                      <span className="font-bold text-white text-lg">Score {reward.score}</span>
                    </div>
                    
                    {/* Points Progress */}
                    {!isRedeemedReward && (
                      <div className="mt-4">
                        <div className="flex justify-between text-sm text-gray-600 mb-2">
                          <span>Available: {availablePoints} pts</span>
                          <span>Needed: {reward.score} pts</span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-1000"
                            style={{ width: `${Math.min(100, (availablePoints / reward.score) * 100)}%` }}
                          ></div>
                        </div>
                        {pointsNeeded > 0 && (
                          <p className="text-sm text-orange-600 mt-2 font-semibold">
                            Need {pointsNeeded} more points to unlock!
                          </p>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Reward Items */}
                  {reward.items && (
                    <div className="mb-6">
                      <h4 className="text-lg font-bold text-gray-800 mb-3">Includes:</h4>
                      <ul className="space-y-2">
                        {reward.items.map((item, index) => (
                          <li key={index} className="flex items-center text-gray-600">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                            <span className="text-base">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Action Button */}
                  <div className="text-center">
                    {isRedeemedReward ? (
                      <div className="text-green-600 font-bold text-lg bg-green-50 px-6 py-3 rounded-2xl border-2 border-green-200">
                        🎉 Successfully Redeemed!
                      </div>
                    ) : isUnlocked ? (
                      <button
                        className="w-full px-6 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl font-bold hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        onClick={() => handleRedeem(reward.id)}
                        disabled={loadingReward === reward.id}
                      >
                        {loadingReward === reward.id ? (
                          <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                            Redeeming...
                          </div>
                        ) : (
                          'Redeem Reward'
                        )}
                      </button>
                    ) : (
                      <div className="text-gray-500 font-medium text-lg bg-gray-50 px-6 py-3 rounded-2xl border-2 border-gray-200">
                        {pointsNeeded > 0 ? (
                          <div>
                            <div className="text-orange-600 font-bold mb-1">Need {pointsNeeded} more points!</div>
                            <div className="text-sm">Keep learning to unlock</div>
                          </div>
                        ) : (
                          'Keep learning to unlock!'
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Rewards; 