import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import useApi from '../../hooks/useApi';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const UserProfile = () => {
  const { user, updateProfile, error } = useAuth();
  const { get } = useApi();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    username: user?.username || '',
    email: user?.email || ''
  });
  const [avatarFile, setAvatarFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [userProgress, setUserProgress] = useState({ score: null, level: null });
  const [userRank, setUserRank] = useState(null);
  const [overallScore, setOverallScore] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profileData = await get(`${BACKEND_URL}/api/user/profile`);
        const userData = profileData.user || profileData;
        setUserProgress({
          score: userData.score ?? 'N/A',
          level: userData.level ?? 'N/A'
        });
        // Fetch overall score from game-progress (same as dashboard)
        const progressData = await get(`${BACKEND_URL}/api/game-progress/all-progress`);
        if (progressData && Array.isArray(progressData.progress)) {
          const total = progressData.progress.reduce((sum, topic) => sum + (topic.totalScore || 0), 0);
          setOverallScore(total);
        } else {
          setOverallScore(0);
        }
      } catch (err) {
        setUserProgress({ score: 'N/A', level: 'N/A' });
        setOverallScore('N/A');
      }
    };
    fetchProfile();
  }, [get]);

  useEffect(() => {
    const fetchRank = async () => {
      if (!user) return;
      try {
        // Fetch leaderboard from the new endpoint (with rank from DB)
        const leaderboardData = await get(`${BACKEND_URL}/api/leaderboard?limit=100`);
        if (leaderboardData && leaderboardData.leaderboard) {
          const found = leaderboardData.leaderboard.find(u => u.username === user.username);
          setUserRank(found && found.rank != null ? found.rank : 'N/A');
        } else {
          setUserRank('N/A');
        }
      } catch (err) {
        setUserRank('N/A');
      }
    };
    fetchRank();
  }, [get, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setAvatarFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const data = new FormData();
      data.append('username', formData.username);
      data.append('email', formData.email);
      if (avatarFile) {
        data.append('avatar', avatarFile);
      }
      await updateProfile(data, true); // true = isFormData
      setIsEditing(false);
      
      // Refresh rank data after profile update to reflect any username changes
      const fetchRank = async () => {
        try {
          const leaderboardData = await get(`${BACKEND_URL}/api/leaderboard?limit=100`);
          if (leaderboardData && leaderboardData.leaderboard) {
            const found = leaderboardData.leaderboard.find(u => u.username === formData.username);
            setUserRank(found && found.rank != null ? found.rank : 'N/A');
          }
        } catch (err) {
          console.error('Error refreshing rank data:', err);
        }
      };
      fetchRank();
    } catch (error) {
      // error is handled by context
    } finally {
      setIsLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Loading Profile</h3>
          <p className="text-green-600">Please wait while we fetch your information...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start font-mono relative overflow-hidden">
      {/* CSS Animation for gradient shift */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Hero Section */}
      <div className="w-full bg-gradient-to-b from-green-200 via-green-100 via-green-50 to-white py-16 relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-gray-600 text-4xl opacity-40">⚡</div>
        <div className="absolute top-20 right-20 text-gray-600 text-3xl opacity-40">🎯</div>
        <div className="absolute bottom-10 left-20 text-gray-600 text-3xl opacity-40">💎</div>
        <div className="absolute bottom-20 right-10 text-gray-600 text-4xl opacity-40">🚀</div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-32 h-32 mb-8 relative">
            {(() => {
              const avatarUrl = user.profile?.avatar || user.avatar;
              return avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt="Profile picture" 
                  className="h-32 w-32 rounded-full object-cover border-4 border-green-500 shadow-2xl ring-4 ring-green-500/30" 
                />
              ) : (
                <div className="h-32 w-32 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-4xl text-white font-bold border-4 border-green-500 shadow-2xl ring-4 ring-green-500/30">
                  {user.username?.charAt(0).toUpperCase()}
                </div>
              );
            })()}
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-white shadow-lg">
              <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-wider text-green-600">
            {user.username}
          </h1>
          
          <div className="flex items-center justify-center space-x-6 mb-8">
            <div className="flex items-center space-x-2">
              <span className="text-2xl">👑</span>
              <span className="text-xl font-bold text-gray-800 font-mono">
                {userRank && userRank !== 'N/A' ? `Rank #${userRank}` : 'Unranked'}
              </span>
            </div>
            <div className="w-px h-8 bg-gray-300"></div>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">⭐</span>
              <span className="text-xl font-bold text-gray-800 font-mono">
                Level {user.level ?? userProgress.level ?? '1'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid Section */}
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-gray-600 text-3xl opacity-80">📊</div>
        <div className="absolute top-20 right-20 text-gray-600 text-4xl opacity-80">🏆</div>
        <div className="absolute bottom-10 left-20 text-gray-600 text-4xl opacity-80">⭐</div>
        <div className="absolute bottom-20 right-10 text-gray-600 text-3xl opacity-80">🎖️</div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              YOUR STATISTICS
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Track your progress and achievements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎯</span>
                </div>
                <span className="text-3xl font-bold text-blue-600 font-mono">
                  {user.level ?? userProgress.level ?? '1'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 font-mono">Level</h3>
              <p className="text-gray-600 text-sm font-mono">Current achievement level</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🏆</span>
                </div>
                <span className="text-3xl font-bold text-green-600 font-mono">
                  {overallScore === 0 ? '0' : (overallScore ?? '0')}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 font-mono">Total Score</h3>
              <p className="text-gray-600 text-sm font-mono">Overall performance points</p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">👑</span>
                </div>
                <span className="text-3xl font-bold text-purple-600 font-mono">
                  {userRank && userRank !== 'N/A' ? `#${userRank}` : 'N/A'}
                </span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-1 font-mono">Global Rank</h3>
              <p className="text-gray-600 text-sm font-mono">Leaderboard position</p>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Information Section */}
      <div className="w-full bg-gradient-to-br from-white via-pink-50 to-purple-50 py-16 relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-gray-600 text-4xl opacity-80">👤</div>
        <div className="absolute top-20 right-20 text-gray-600 text-3xl opacity-80">📧</div>
        <div className="absolute bottom-10 left-20 text-gray-600 text-3xl opacity-80">📅</div>
        <div className="absolute bottom-20 right-10 text-gray-600 text-4xl opacity-80">🔐</div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              PROFILE INFORMATION
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Your account details and preferences
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-green-600 mb-2 font-mono">Username</label>
                  <p className="text-gray-800 font-mono text-lg">{user.username}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-green-600 mb-2 font-mono">Email</label>
                  <p className="text-gray-800 font-mono text-lg">{user.email}</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-green-600 mb-2 font-mono">Member Since</label>
                  <p className="text-gray-800 font-mono text-lg">{new Date().toLocaleDateString()}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-mono">Total Score</span>
                  <span className="text-gray-800 font-bold font-mono text-lg">{overallScore || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-mono">Current Level</span>
                  <span className="text-gray-800 font-bold font-mono text-lg">{user.level ?? userProgress.level ?? '1'}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 font-mono">Global Rank</span>
                  <span className="text-gray-800 font-bold font-mono text-lg">{userRank && userRank !== 'N/A' ? `#${userRank}` : 'Unranked'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Settings Section */}
      <div className="w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 py-16 relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-gray-600 text-3xl opacity-80">⚙️</div>
        <div className="absolute top-20 right-20 text-gray-600 text-4xl opacity-80">🔧</div>
        <div className="absolute bottom-10 left-20 text-gray-600 text-4xl opacity-80">🎛️</div>
        <div className="absolute bottom-20 right-10 text-gray-600 text-3xl opacity-80">🔨</div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              PROFILE SETTINGS
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Manage your account settings and preferences
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            {isEditing ? (
              <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <label htmlFor="username" className="block text-sm font-bold text-green-600 mb-3 font-mono">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      id="username"
                      value={formData.username}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-mono"
                      placeholder="Enter your username"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="block text-sm font-bold text-green-600 mb-3 font-mono">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-mono"
                      placeholder="Enter your email address"
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="avatar" className="block text-sm font-bold text-green-600 mb-3 font-mono">
                    Profile Picture
                  </label>
                  <div className="flex items-center space-x-6">
                    <div className="flex-shrink-0">
                      {(() => {
                        const avatarUrl = user.profile?.avatar || user.avatar;
                        return avatarUrl ? (
                          <img 
                            src={avatarUrl} 
                            alt="Current profile picture" 
                            className="h-20 w-20 rounded-full object-cover border-4 border-green-500 shadow-lg" 
                          />
                        ) : (
                          <div className="h-20 w-20 rounded-full bg-gradient-to-br from-green-500 to-blue-600 flex items-center justify-center text-2xl text-white font-bold border-4 border-green-500 shadow-lg">
                            {user.username?.charAt(0).toUpperCase()}
                          </div>
                        );
                      })()}
                    </div>
                    <div className="flex-1">
                      <input
                        type="file"
                        name="avatar"
                        id="avatar"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl text-gray-800 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-green-500 file:text-white hover:file:bg-green-600 transition-all duration-200"
                      />
                      <p className="text-sm text-gray-500 mt-2 font-mono">Recommended: Square image, max 5MB</p>
                    </div>
                  </div>
                </div>
                
                {error && (
                  <div className="bg-red-50 border border-red-200 rounded-xl p-4">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-600 font-medium font-mono">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
                
                <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-3 bg-gray-200 text-gray-800 rounded-xl hover:bg-gray-300 transition-all duration-200 font-bold font-mono"
                    disabled={isLoading}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-bold font-mono disabled:opacity-50 disabled:cursor-not-allowed shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                        Saving Changes...
                      </div>
                    ) : (
                      'Save Changes'
                    )}
                  </button>
                </div>
              </form>
            ) : (
              <div className="text-center py-8">
                <span className="text-4xl mb-4 block">⚙️</span>
                <p className="text-gray-600 mb-6 font-mono">Manage your account settings and preferences.</p>
                <button
                  onClick={() => setIsEditing(true)}
                  className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-bold font-mono shadow-lg"
                >
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile; 