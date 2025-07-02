import React, { useEffect, useState } from 'react';
import useApi from '../hooks/useApi';
import { useAuth } from '../contexts/AuthContext';
import { useLoading } from '../hooks/useLoading';
import { FriendsLoading } from './Loading';
import { Link } from 'react-router-dom';

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

const Friends = () => {
  const { get, post } = useApi();
  const { user } = useAuth();
  const { isLoading, withLoading } = useLoading(true);

  const [friends, setFriends] = useState([]);
  const [requests, setRequests] = useState([]);
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [message, setMessage] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch friends and requests
  const fetchData = async () => {
    await withLoading(async () => {
      const friendsRes = await get(`${BACKEND_URL}/api/user/friends`);
      setFriends(friendsRes.friends || []);
      const reqRes = await get(`${BACKEND_URL}/api/user/friend-requests`);
      setRequests(reqRes.friendRequests || []);
    }, 'Loading Friends...');
  };

  useEffect(() => {
    fetchData();
  }, [get]);

  // Search users by username
  const handleSearch = async () => {
    setMessage('');
    setSearchResults([]);
    if (!search.trim()) return;
    
    setSearchLoading(true);
    try {
      const res = await get(`${BACKEND_URL}/api/user/search?username=${search}`);
      setSearchResults(res.users || []);
    } catch (err) {
      setMessage('User not found');
    }
    setSearchLoading(false);
  };

  // Send friend request
  const handleSendRequest = async (toUserId) => {
    setMessage('');
    try {
      await post(`${BACKEND_URL}/api/user/friends/request`, { toUserId });
      setMessage('Friend request sent!');
      setSearchResults([]);
      setSearch('');
      fetchData();
    } catch (err) {
      setMessage('Failed to send request');
    }
  };

  // Accept friend request
  const handleAccept = async (fromUserId) => {
    setMessage('');
    try {
      await post(`${BACKEND_URL}/api/user/friends/accept`, { fromUserId });
      setMessage('Friend request accepted!');
      fetchData();
    } catch (err) {
      setMessage('Failed to accept request');
    }
  };

  // Reject friend request
  const handleReject = async (fromUserId) => {
    setMessage('');
    try {
      await post(`${BACKEND_URL}/api/user/friends/reject`, { fromUserId });
      setMessage('Friend request rejected!');
      fetchData();
    } catch (err) {
      setMessage('Failed to reject request');
    }
  };

  // Remove friend
  const handleRemoveFriend = async (friendUserId) => {
    setMessage('');
    try {
      await post(`${BACKEND_URL}/api/user/friends/remove`, { friendUserId });
      setMessage('Friend removed!');
      fetchData();
    } catch (err) {
      setMessage('Failed to remove friend');
    }
  };

  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  const getRandomColor = (username) => {
    const colors = [
      'from-blue-500 to-blue-600',
      'from-green-500 to-green-600',
      'from-purple-500 to-purple-600',
      'from-pink-500 to-pink-600',
      'from-yellow-500 to-yellow-600',
      'from-red-500 to-red-600',
      'from-indigo-500 to-indigo-600',
      'from-teal-500 to-teal-600'
    ];
    const index = username.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono">
        <FriendsLoading />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white font-mono relative overflow-hidden">
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
              <span className="text-3xl">👥</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4 font-mono">
              Friends
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Build your DSA learning community and connect with fellow programmers
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
          {/* Search Section */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 mb-8">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6 rounded-2xl mb-6">
              <h2 className="text-2xl font-bold text-white font-mono">Find New Friends</h2>
              <p className="text-blue-100 mt-1">Search for fellow DSA learners to connect with</p>
            </div>
            
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search by username..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    onKeyPress={e => e.key === 'Enter' && handleSearch()}
                    className="w-full px-6 py-4 pl-12 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-blue-200 focus:border-blue-500 transition-all duration-300 shadow-sm"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <button
                onClick={handleSearch}
                disabled={searchLoading || !search.trim()}
                className={`px-8 py-4 rounded-2xl font-bold font-mono transition-all duration-300 transform hover:scale-105 shadow-lg ${
                  searchLoading || !search.trim()
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 hover:shadow-xl'
                }`}
              >
                {searchLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                    Searching...
                  </div>
                ) : (
                  'Search Users'
                )}
              </button>
            </div>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-8">
                <h3 className="text-xl font-bold text-gray-800 mb-6 font-mono">Search Results</h3>
                <div className="grid gap-4">
                  {searchResults.map(user => (
                    <div key={user._id} className="flex items-center justify-between p-6 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-blue-200 hover:shadow-lg transition-all duration-300">
                      <div className="flex items-center space-x-4">
                        <div className={`w-12 h-12 bg-gradient-to-r ${getRandomColor(user.username)} rounded-2xl flex items-center justify-center shadow-lg`}>
                          <span className="text-white font-bold text-lg">
                            {getInitials(user.username)}
                          </span>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-gray-800">{user.username}</div>
                          <div className="text-gray-600 text-sm flex items-center">
                            <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                            DSA Learner
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleSendRequest(user._id)}
                        className="px-6 py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl font-bold hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                      >
                        Add Friend
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
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

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Friends List */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6">
                <h2 className="text-2xl font-bold text-white font-mono flex items-center">
                  <span className="mr-3 text-2xl">👥</span>
                  Your Friends ({friends.length})
                </h2>
                <p className="text-green-100 mt-1">Your DSA learning community</p>
              </div>
              
              <div className="p-6">
                {friends.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">👥</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No friends yet</h3>
                    <p className="text-gray-600 text-lg">Start by searching for other DSA learners!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {friends.map(friend => (
                      <div key={friend._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-green-200 hover:shadow-lg transition-all duration-300">
                        <Link to={`/profile/${friend._id}`} className="flex items-center space-x-4 group">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getRandomColor(friend.username)} rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                            <span className="text-white font-bold text-lg">
                              {getInitials(friend.username)}
                            </span>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-800 group-hover:text-green-600 transition-colors">{friend.username}</div>
                          </div>
                        </Link>
                        <button
                          onClick={() => handleRemoveFriend(friend._id)}
                          className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Friend Requests */}
            <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6">
                <h2 className="text-2xl font-bold text-white font-mono flex items-center">
                  <span className="mr-3 text-2xl">📨</span>
                  Friend Requests ({requests.length})
                </h2>
                <p className="text-orange-100 mt-1">Pending connection requests</p>
              </div>
              
              <div className="p-6">
                {requests.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <span className="text-4xl">📨</span>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-4">No pending requests</h3>
                    <p className="text-gray-600 text-lg">You're all caught up!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {requests.map(request => (
                      <div key={request._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl border-2 border-gray-100 hover:border-orange-200 hover:shadow-lg transition-all duration-300">
                        <div className="flex items-center space-x-4">
                          <div className={`w-12 h-12 bg-gradient-to-r ${getRandomColor(request.username)} rounded-2xl flex items-center justify-center shadow-lg`}>
                            <span className="text-white font-bold text-lg">
                              {getInitials(request.username)}
                            </span>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-gray-800">{request.username}</div>
                            <div className="text-orange-600 text-sm flex items-center">
                              <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                              Wants to be your friend
                            </div>
                          </div>
                        </div>
                        <div className="flex space-x-3">
                          <button
                            onClick={() => handleAccept(request._id)}
                            className="px-4 py-2 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-xl font-semibold hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Accept
                          </button>
                          <button
                            onClick={() => handleReject(request._id)}
                            className="px-4 py-2 bg-gradient-to-r from-red-500 to-pink-500 text-white rounded-xl font-semibold hover:from-red-600 hover:to-pink-600 transition-all duration-300 transform hover:scale-105 shadow-lg"
                          >
                            Reject
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Friends; 