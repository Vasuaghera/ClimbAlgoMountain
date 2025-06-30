import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useApi from '../hooks/useApi';
import { useLoading } from '../hooks/useLoading';
import { DataLoading } from './Loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Leaderboard = () => {
  const { user } = useAuth();
  const { get } = useApi();
  const { isLoading, withLoading } = useLoading(true);
  const [leaderboard, setLeaderboard] = useState([]);
  const [error, setError] = useState(null);
  const [userRank, setUserRank] = useState(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      try {
        await withLoading(async () => {
          const data = await get(`${BACKEND_URL}/api/leaderboard?limit=20`);
          setLeaderboard(data.leaderboard || []);
          
          // Find user's rank
          if (user && data.leaderboard) {
            const found = data.leaderboard.find(entry => entry.username === user.username);
            setUserRank(found ? found.rank : null);
          }
        }, 'Loading Leaderboard...');
      } catch (err) {
        setError('Failed to load leaderboard');
      }
    };
    fetchLeaderboard();
  }, [get, user, withLoading]);

  const getRankIcon = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'from-yellow-400 to-yellow-600';
    if (rank === 2) return 'from-gray-300 to-gray-500';
    if (rank === 3) return 'from-orange-400 to-orange-600';
    return 'from-gray-500 to-gray-700';
  };

  const getInitials = (username) => {
    return username ? username.charAt(0).toUpperCase() : '?';
  };

  const getRandomColor = (username) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-indigo-500 to-indigo-600',
      'from-red-500 to-red-600',
      'from-yellow-500 to-yellow-600',
      'from-teal-500 to-teal-600'
    ];
    const index = username ? username.charCodeAt(0) % colors.length : 0;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen pt-24 bg-white flex items-center justify-center">
        <DataLoading />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen pt-24 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-500 rounded-2xl shadow-lg mb-6">
            <span className="text-2xl">⚠️</span>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Error Loading Leaderboard</h3>
          <p className="text-red-600">{error}</p>
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
        <div className="absolute top-10 left-10 text-gray-600 text-4xl opacity-80">🏆</div>
        <div className="absolute top-20 right-20 text-gray-600 text-3xl opacity-80">🥇</div>
        <div className="absolute bottom-10 left-20 text-gray-600 text-3xl opacity-80">🥈</div>
        <div className="absolute bottom-20 right-10 text-gray-600 text-4xl opacity-80">🥉</div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-yellow-200 to-orange-400 rounded-2xl mb-6 shadow-xl">
            <span className="text-4xl">🏆</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-wider text-green-600">
          ALL RANKINGS
          </h1>
          <p className="text-xl pt-4 text-blue-400 max-w-3xl mx-auto font-mono">
            Compete with the best DSA learners and climb to the top of the rankings
          </p>
          <p className="pt-4 text-pink-400 text-lg font-mono">
              Complete leaderboard of all participants
            </p>
        </div>
      </div>

      {/* Top 3 Podium Section */}
      {leaderboard.length >= 3 && (
        <div className="w-full bg-gradient-to-br from-white via-yellow-50 to-orange-50 py-16 relative">
          {/* Decorative elements */}
          <div className="absolute top-10 left-10 text-gray-600 text-3xl opacity-80">👑</div>
          <div className="absolute top-20 right-20 text-gray-600 text-4xl opacity-80">⭐</div>
          <div className="absolute bottom-10 left-20 text-gray-600 text-4xl opacity-80">🎖️</div>
          <div className="absolute bottom-20 right-10 text-gray-600 text-3xl opacity-80">🏅</div>
          
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
                TOP 3 CHAMPIONS
              </h2>
              <p className="text-gray-700 text-lg font-mono">
                The elite performers who dominate the leaderboard
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              <div className="order-2 md:order-1">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-gray-400 to-gray-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">🥈</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">#{leaderboard[1]?.rank}</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-gray-400 to-gray-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {getInitials(leaderboard[1]?.username)}
                    </span>
                  </div>
                  <p className="text-gray-800 font-bold mb-1 font-mono">{leaderboard[1]?.username}</p>
                  <p className="text-gray-600 text-sm font-mono">{leaderboard[1]?.score} points</p>
                </div>
              </div>

              {/* 1st Place */}
              <div className="order-1 md:order-2">
                <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-yellow-300 text-center transform hover:scale-105 transition-all duration-300 relative">
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <div className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                      🏆 CHAMPION
                    </div>
                  </div>
                  <div className="w-20 h-20 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-3xl">🥇</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2 font-mono">#{leaderboard[0]?.rank}</h3>
                  <div className="w-16 h-16 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-white font-bold">
                      {getInitials(leaderboard[0]?.username)}
                    </span>
                  </div>
                  <p className="text-gray-800 font-bold text-lg mb-1 font-mono">{leaderboard[0]?.username}</p>
                  <p className="text-orange-600 font-bold font-mono">{leaderboard[0]?.score} points</p>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="order-3">
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 text-center transform hover:scale-105 transition-all duration-300">
                  <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <span className="text-2xl">🥉</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">#{leaderboard[2]?.rank}</h3>
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg">
                    <span className="text-white font-bold text-sm">
                      {getInitials(leaderboard[2]?.username)}
                    </span>
                  </div>
                  <p className="text-gray-800 font-bold mb-1 font-mono">{leaderboard[2]?.username}</p>
                  <p className="text-gray-600 text-sm font-mono">{leaderboard[2]?.score} points</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* All Rankings Section */}
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 relative">
        {/* Decorative elements */}
        <div className="absolute top-10 left-10 text-gray-600 text-4xl opacity-80">📊</div>
        <div className="absolute top-20 right-20 text-gray-600 text-3xl opacity-80">📈</div>
        <div className="absolute bottom-10 left-20 text-gray-600 text-3xl opacity-80">🎯</div>
        <div className="absolute bottom-20 right-10 text-gray-600 text-4xl opacity-80">🏆</div>
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-green-50 to-blue-50">
              <h3 className="text-xl font-bold text-gray-800 font-mono">Rankings Table</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="py-4 px-6 text-left text-gray-700 font-bold font-mono">Rank</th>
                    <th className="py-4 px-6 text-left text-gray-700 font-bold font-mono">Player</th>
                    <th className="py-4 px-6 text-left text-gray-700 font-bold font-mono">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {leaderboard.map((entry, index) => (
                    <tr
                      key={entry.rank}
                      className={`border-b border-gray-100 transition-all duration-300 hover:bg-gray-50 ${
                        user && entry.username === user.username
                          ? 'bg-green-50 border-green-200'
                          : ''
                      }`}
                    >
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 bg-gradient-to-r ${getRankColor(entry.rank)} rounded-lg flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-sm">
                              {getRankIcon(entry.rank)}
                            </span>
                          </div>
                          <span className="text-gray-800 font-bold font-mono">#{entry.rank}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center space-x-3">
                          <div className={`w-10 h-10 bg-gradient-to-r ${getRandomColor(entry.username)} rounded-xl flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-sm">
                              {getInitials(entry.username)}
                            </span>
                          </div>
                          <div>
                            <div className="text-gray-800 font-bold font-mono">{entry.username}</div>
                            {user && entry.username === user.username && (
                              <div className="text-green-600 text-sm font-mono">● You</div>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-gray-800 font-bold font-mono">{entry.score}</div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Leaderboard; 