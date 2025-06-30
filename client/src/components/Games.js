import React, { useEffect, useState, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useApi from '../hooks/useApi';
import { useLoading } from '../hooks/useLoading';
import { Link } from 'react-router-dom';
import { GameLoading, DataLoading } from './Loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Games = () => {
  const { user, loading: authLoading, hasPremiumAccess, refreshUserProfile } = useAuth();
  const { get, loading: apiLoading, error: apiError } = useApi();
  const { isLoading, withLoading } = useLoading(true);
  const [topics, setTopics] = React.useState([]);
  const [userProgress, setUserProgress] = React.useState([]);
  const [sortingGameProgress, setSortingGameProgress] = React.useState(null);
  const [stackQueueGameProgress, setStackQueueGameProgress] = React.useState(null);
  const [windowPointerGameProgress, setWindowPointerGameProgress] = React.useState(null);
  const [patternGameProgress, setPatternGameProgress] = React.useState(null);
  const [heapPriorityQueueGameProgress, setHeapPriorityQueueGameProgress] = React.useState(null);
  const [arraysGameProgress, setArraysGameProgress] = React.useState(null);
  const [stringsGameProgress, setStringsGameProgress] = React.useState(null);
  const [linkedListsGameProgress, setLinkedListsGameProgress] = React.useState(null);
  const [binaryTreesGameProgress, setBinaryTreesGameProgress] = React.useState(null);
  const [recursionGameProgress, setRecursionGameProgress] = React.useState(null);
  const [graphsGameProgress, setGraphsGameProgress] = React.useState(null);
  const [treeGameProgress, setTreeGameProgress] = React.useState(null);
  const [dpGameProgress, setDpGameProgress] = React.useState(null);
  const [bitManipulationGameProgress, setBitManipulationGameProgress] = React.useState(null);
  const [games, setGames] = React.useState([]);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [hasFetched, setHasFetched] = useState(false);
  const [lastRefreshTime, setLastRefreshTime] = useState(Date.now());

  // console.log('hasPremiumAccess:', hasPremiumAccess);

  // Function to fetch and process progress data
  const fetchProgressData = async () => {
    if (!user) {
      setUserProgress([]);
      return;
    }
    
    await withLoading(async () => {
      const [topicsData, userProgressData] = await Promise.all([
        get(`${BACKEND_URL}/api/topics`),
        get(`${BACKEND_URL}/api/game-progress/all-progress`)
      ]);

      setTopics(topicsData);
      setUserProgress(userProgressData && userProgressData.progress ? userProgressData.progress : []);

      // Process game progress entries with better error handling
      const progressArray = userProgressData && userProgressData.progress ? userProgressData.progress : [];
      
      const gameProgressEntries = {
        'sorting': progressArray.find(p => p.topicId === 'sorting') || progressArray.find(p => p.topicId === 'sorting-algorithms'),
        'stack-queue': progressArray.find(p => p.topicId === 'stack-queue'),
        'sliding-window-two-pointer': progressArray.find(p => p.topicId === 'sliding-window-two-pointer'),
        'dynamic-programming': progressArray.find(p => p.topicId === 'dynamic-programming') || progressArray.find(p => p.topicId === 'dp'),
        'heap-priority-queue': progressArray.find(p => p.topicId === 'heap-priority-queue') || progressArray.find(p => p.topicId === 'heaps'),
        'arrays': progressArray.find(p => p.topicId === 'arrays'),
        'strings': progressArray.find(p => p.topicId === 'strings') || progressArray.find(p => p.topicId === 'stringmanipulation'),
        'linked-lists': progressArray.find(p => p.topicId === 'linked-lists'),
        'binary-trees': progressArray.find(p => p.topicId === 'binary-trees') || progressArray.find(p => p.topicId === 'binary-tree'),
        'recursion': progressArray.find(p => p.topicId === 'recursion'),
        'graphs': progressArray.find(p => p.topicId === 'graphs') || progressArray.find(p => p.topicId === 'graph'),
        'dp': progressArray.find(p => p.topicId === 'dp') || progressArray.find(p => p.topicId === 'dynamic-programming'),
        'bit-manipulation': progressArray.find(p => p.topicId === 'bit-manipulation'),
      };

      // Update all game progress states with null fallbacks
      setSortingGameProgress(gameProgressEntries['sorting'] || null);
      setStackQueueGameProgress(gameProgressEntries['stack-queue'] || null);
      setWindowPointerGameProgress(gameProgressEntries['sliding-window-two-pointer'] || null);
      setPatternGameProgress(gameProgressEntries['dynamic-programming'] || null);
      setHeapPriorityQueueGameProgress(gameProgressEntries['heap-priority-queue'] || null);
      setArraysGameProgress(gameProgressEntries['arrays'] || null);
      setStringsGameProgress(gameProgressEntries['strings'] || null);
      setLinkedListsGameProgress(gameProgressEntries['linked-lists'] || null);
      setBinaryTreesGameProgress(gameProgressEntries['binary-trees'] || null);
      setRecursionGameProgress(gameProgressEntries['recursion'] || null);
      setGraphsGameProgress(gameProgressEntries['graphs'] || null);
      setTreeGameProgress(gameProgressEntries['binary-tree'] || null);
      setDpGameProgress(gameProgressEntries['dp'] || null);
      setBitManipulationGameProgress(gameProgressEntries['bit-manipulation'] || null);

      setLastRefreshTime(Date.now());
      setHasFetched(true);
    }, 'Loading Games...');
  };

  React.useEffect(() => {
    if (!user || hasFetched) return;
    fetchProgressData();
  }, [get, user, hasFetched]);

  // Function to refresh progress data
  const refreshProgressData = async () => {
    setHasFetched(false); // Reset to trigger a fresh fetch
    // Don't call fetchProgressData() here as it will cause infinite loop
    // The useEffect will handle the fetch when hasFetched becomes false
  };

  // Refresh data when user returns to the page
  useEffect(() => {
    const handleFocus = () => {
      if (user) {
        refreshProgressData();
        // Don't call refreshUserProfile here to prevent infinite loops
      }
    };

    window.addEventListener('focus', handleFocus);
    return () => window.removeEventListener('focus', handleFocus);
  }, [user]);

  // Add event listener for progress updates from games
  useEffect(() => {
    const handleProgressUpdate = () => {
      refreshProgressData();
      // Don't call refreshUserProfile here to prevent infinite loops
    };

    const handleLevelCompleted = () => {
      refreshProgressData();
      // Don't call refreshUserProfile here to prevent infinite loops
    };

    // Listen for custom progress update events
    window.addEventListener('progressUpdated', handleProgressUpdate);
    window.addEventListener('levelCompleted', handleLevelCompleted);
    
    // Also listen for storage changes (when games save progress)
    const handleStorageChange = (e) => {
      if (e.key === 'gameProgress' || e.key === 'userProgress') {
        refreshProgressData();
        // Don't call refreshUserProfile here to prevent infinite loops
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('progressUpdated', handleProgressUpdate);
      window.removeEventListener('levelCompleted', handleLevelCompleted);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []); // Empty dependency array to prevent infinite loop

  // Ensure DP topic is always present in topics for dashboard display
  React.useEffect(() => {
    if (Array.isArray(topics) && !topics.some(t => t.topicId === 'dp')) {
      setTopics(prev => [
        ...prev,
        {
          _id: 'dp-temporary',
          name: 'Dynamic Programming',
          description: 'Master the art of solving complex problems by breaking them down into simpler subproblems!',
          difficulty: 'advanced',
          topicId: 'dp'
        }
      ]);
    }
  }, [topics]);

  // Remove Pattern Master from topics
  const filteredTopics = Array.isArray(topics)
    ? topics.filter(
        t => t.topicId !== 'pattern-master' && t.name !== 'Pattern Master'
      )
    : [];

  // Filter out duplicate DP topics (dp or dynamic-programming) before rendering
  const uniqueFilteredTopics = filteredTopics.filter((topic, idx, arr) => {
    // Check if this topic is any form of Dynamic Programming
    const isDPTopic = topic.topicId === 'dp' || 
                     topic.topicId === 'dynamic-programming' || 
                     topic.name?.toLowerCase().includes('dynamic programming');
    
    if (isDPTopic) {
      // Only keep the first occurrence of any DP topic
      const firstDPIndex = arr.findIndex(t => 
        t.topicId === 'dp' || 
        t.topicId === 'dynamic-programming' || 
        t.name?.toLowerCase().includes('dynamic programming')
      );
      return firstDPIndex === idx;
    }
    return true;
  });

  // Helper to check if a topic has progress
  const hasProgress = (topicId) => userProgress.some(progress => progress.topicId === (topicId === 'tree' ? 'binary-tree' : topicId));

  // Helper to check if user has access to a specific game or via bundle
  function hasGameAccess(user, gameId) {
    if (!user?.premiumAccess) return false;
    if (user.premiumAccess.includes(gameId)) return true;
    if (user.premiumAccess.includes('bundle') && (gameId === 'binary-tree' || gameId === 'graph')) return true;
    return false;
  }

  // Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) return resolve(true);
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Purchase handler
  const handlePurchase = async (product) => {
    setPurchaseLoading(true);
    setPurchaseMessage('');
    const scriptLoaded = await loadRazorpayScript();
    if (!scriptLoaded) {
      setPurchaseLoading(false);
      setPurchaseMessage('Failed to load payment gateway. Please try again.');
      return;
    }
    try {
      // Map product to gameId
      let gameId = '';
      if (product === 'tree') gameId = 'binary-tree';
      else if (product === 'graph') gameId = 'graph';
      else if (product === 'both') gameId = 'bundle';
      else {
        setPurchaseLoading(false);
        setPurchaseMessage('Invalid product.');
        return;
      }
      // 1. Create order on backend
      const res = await fetch(`${BACKEND_URL}/api/premium/razorpay/order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ gameId }),
      });
      const data = await res.json();
      if (!data || !data.orderId) throw new Error(data.message || 'Order creation failed');

      // 2. Open Razorpay modal
      const options = {
        key: process.env.REACT_APP_RAZORPAY_KEY_ID , // Replace with your Razorpay key or from backend
        amount: data.amount,
        currency: 'INR',
        name: 'DSA Game Premium',
        description: `Purchase ${product === 'tree' ? 'Tree' : product === 'graph' ? 'Graph' : 'Tree & Graph'} Premium`,
        order_id: data.orderId,
        handler: async function (response) {
          setPurchaseMessage('Verifying payment...');
          const verifyRes = await fetch(`${BACKEND_URL}/api/premium/razorpay/verify`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
            body: JSON.stringify({
              ...response,
              gameId,
            }),
          });
          const verifyData = await verifyRes.json();
          if (verifyData.userAccess) {
            // Update user.premiumAccess in UI instantly
            if (user && user.premiumAccess) {
              user.premiumAccess = verifyData.userAccess;
            }
          }
          if (verifyData.success || verifyData.message?.toLowerCase().includes('verified')) {
            setPurchaseMessage('Payment successful! Premium access granted.');
            refreshUserProfile && refreshUserProfile();
            setTimeout(() => setPurchaseMessage(''), 3000);
          } else {
            setPurchaseMessage(verifyData.message || 'Payment verification failed. Please contact support.');
          }
          setPurchaseLoading(false);
        },
        prefill: {
          name: user?.profile?.name || user?.name || '',
          email: user?.profile?.email || user?.email || '',
        },
        theme: {
          color: '#f59e42',
        },
        modal: {
          ondismiss: () => setPurchaseLoading(false),
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      setPurchaseMessage(err.message || 'Something went wrong. Please try again.');
      setPurchaseLoading(false);
    }
  };

  const getGameIcon = (topicId) => {
    const icons = {
      'arrays': 'A',
      'strings': 'S',
      'linked-lists': 'L',
      'sorting': 'S',
      'stack-queue': 'Q',
      'sliding-window-two-pointer': 'W',
      'heap-priority-queue': 'H',
      'binary-trees': 'T',
      'recursion': 'R',
      'graphs': 'G',
      'dp': 'D',
      'dynamic-programming': 'D',
      'bit-manipulation': 'B'
    };
    return icons[topicId] || 'G';
  };

  // Decorative data structure components
  const ArrayDecoration = ({ position }) => (
    <div className={`absolute ${position} top-4 opacity-70 pointer-events-none`}>
      <div className="flex space-x-1">
        <div className="w-6 h-6 bg-blue-700 text-white text-xs rounded flex items-center justify-center shadow-md">5</div>
        <div className="w-6 h-6 bg-green-700 text-white text-xs rounded flex items-center justify-center shadow-md">2</div>
        <div className="w-6 h-6 bg-purple-700 text-white text-xs rounded flex items-center justify-center shadow-md">8</div>
      </div>
    </div>
  );

  const TreeDecoration = ({ position }) => (
    <div className={`absolute ${position} top-4 opacity-70 pointer-events-none`}>
      <div className="text-center">
        <div className="w-4 h-4 bg-green-800 rounded-full mx-auto mb-1 shadow-md"></div>
        <div className="flex justify-center space-x-2">
          <div className="w-3 h-3 bg-green-700 rounded-full shadow-md"></div>
          <div className="w-3 h-3 bg-green-700 rounded-full shadow-md"></div>
        </div>
      </div>
    </div>
  );

  const LinkedListDecoration = ({ position }) => (
    <div className={`absolute ${position} top-4 opacity-70 pointer-events-none`}>
      <div className="flex items-center space-x-1">
        <div className="w-4 h-4 bg-orange-700 rounded-full shadow-md"></div>
        <div className="w-2 h-0.5 bg-gray-600"></div>
        <div className="w-4 h-4 bg-orange-700 rounded-full shadow-md"></div>
        <div className="w-2 h-0.5 bg-gray-600"></div>
        <div className="w-4 h-4 bg-orange-700 rounded-full shadow-md"></div>
      </div>
    </div>
  );

  const StackDecoration = ({ position }) => (
    <div className={`absolute ${position} top-4 opacity-70 pointer-events-none`}>
      <div className="flex flex-col space-y-1">
        <div className="w-8 h-3 bg-red-700 rounded shadow-md"></div>
        <div className="w-8 h-3 bg-red-600 rounded shadow-md"></div>
        <div className="w-8 h-3 bg-red-500 rounded shadow-md"></div>
      </div>
    </div>
  );

  const QueueDecoration = ({ position }) => (
    <div className={`absolute ${position} top-4 opacity-70 pointer-events-none`}>
      <div className="flex space-x-1">
        <div className="w-3 h-6 bg-blue-600 rounded shadow-md"></div>
        <div className="w-3 h-6 bg-blue-700 rounded shadow-md"></div>
        <div className="w-3 h-6 bg-blue-800 rounded shadow-md"></div>
      </div>
    </div>
  );

  if (authLoading || apiLoading) {
    return <div>Loading dashboard...</div>;
  }

  if (apiError) {
    return <div>Error loading dashboard data: {apiError?.message || 'An unknown error occurred.'}</div>;
  }

  const completedTopicsCount = userProgress.filter(item => item.completed).length || 0;
  const overallScore = userProgress.reduce((sum, topic) => sum + (topic.totalScore || 0), 0) || 0;

  const sortingTotalScore = sortingGameProgress?.totalScore || 0;
  const stackQueueTotalScore = stackQueueGameProgress?.totalScore || 0;
  const windowPointerTotalScore = windowPointerGameProgress?.totalScore || 0;
  const patternTotalScore = patternGameProgress?.totalScore || 0;
  const heapPriorityQueueTotalScore = heapPriorityQueueGameProgress?.totalScore || 0;
  const arraysTotalScore = arraysGameProgress?.totalScore || 0;
  const stringsTotalScore = stringsGameProgress?.totalScore || 0;
  const linkedListsTotalScore = linkedListsGameProgress?.totalScore || 0;
  const binaryTreesTotalScore = binaryTreesGameProgress?.totalScore || 0;
  const recursionTotalScore = recursionGameProgress?.totalScore || 0;
  const graphsTotalScore = graphsGameProgress?.totalScore || 0;
  const treeTotalScore = treeGameProgress?.totalScore || 0;
  const dpTotalScore = dpGameProgress?.totalScore || 0;
  const bitManipulationTotalScore = bitManipulationGameProgress?.totalScore || 0;

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start font-mono relative overflow-hidden">
      {/* Loading Animation */}
      {isLoading && <GameLoading />}
      
      {/* CSS Animation for gradient shift */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Progress Overview Section */}
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 relative">
        <LinkedListDecoration position="left-8" />
        <StackDecoration position="right-8" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              YOUR PROGRESS OVERVIEW
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Track your learning journey and achievements
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1 font-mono">Level</p>
                  <p className="text-3xl font-bold text-gray-800 font-mono">
                    { (user?.level === undefined || user?.level === null || user?.level === 0 ) ? 0 : user.level}
                  </p>
            
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">⭐</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1 font-mono">Overall Score</p>
                  <p className="text-3xl font-bold text-gray-800 font-mono">{overallScore}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🏆</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1 font-mono">Completed</p>
                  <p className="text-3xl font-bold text-gray-800 font-mono"> {user?.level === undefined || user?.level === null ? 0 : user.level}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">✅</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm mb-1 font-mono">Total Games</p>
                  <p className="text-3xl font-bold text-gray-800 font-mono">{filteredTopics.length}</p>
                </div>
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-2xl">🎯</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Game Scores Section */}
      <div className="w-full bg-gradient-to-br from-white via-pink-50 to-purple-50 py-16 relative">
        <QueueDecoration position="left-8" />
        <ArrayDecoration position="right-8" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              GAME SCORES
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Your performance across all DSA topics
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Sorting</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{sortingTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-green-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">📚</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Stack & Queue</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{stackQueueTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🪟</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Window & Pointer</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{windowPointerTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-pink-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🗂️</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Heap & PQ</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{heapPriorityQueueTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-orange-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">📊</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Arrays</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{arraysTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-red-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🔤</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Strings</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{stringsTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-blue-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🔗</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Linked Lists</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{linkedListsTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-green-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🌳</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Binary Trees</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{binaryTreesTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Recursion</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{recursionTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-pink-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🕸️</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Graphs</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{graphsTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-orange-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Dynamic Programming</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{dpTotalScore}</p>
            </div>
            <div className="bg-white rounded-xl p-4 shadow-lg border border-purple-200 text-center hover:shadow-xl transition-all duration-300">
              <div className="text-2xl mb-2">🔄</div>
              <p className="text-gray-600 text-xs mb-1 font-mono">Bit Manipulation</p>
              <p className="text-gray-800 font-bold text-lg font-mono">{bitManipulationTotalScore}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Available Topics Section */}
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 relative">
        <TreeDecoration position="left-8" />
        <LinkedListDecoration position="right-8" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              AVAILABLE TOPICS
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Choose your learning path and start mastering DSA concepts
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {uniqueFilteredTopics.map((topic) => {
              if (!topic || !topic._id || !topic.topicId) {
                return null;
              }
              
              let currentTopicProgress = userProgress.find(p => p.topicId === topic.topicId);

              if (topic.topicId === 'sorting-algorithms' && !currentTopicProgress) {
                currentTopicProgress = userProgress.find(p => p.topicId === 'sorting');
              }

              let progressPercentage = 0;
              let isCompleted = false;

              if (currentTopicProgress) {
                if (currentTopicProgress.gameLevels && Array.isArray(currentTopicProgress.gameLevels)) {
                  const completedLevels = currentTopicProgress.gameLevels.filter(level => level.completed).length;
                  progressPercentage = (completedLevels / 10) * 100;
                  isCompleted = currentTopicProgress.gameLevels.every(level => level.completed);
                } else {
                  isCompleted = currentTopicProgress.completed || false;
                  progressPercentage = isCompleted ? 100 : 0;
                }
              }
              
              const progress = userProgress.find(p => p.topicId === topic.topicId);
              const gameConfig = games.find(g => g.topicId === topic.topicId);
              const fallbackPaths = {
                'linked-lists': '/linked-lists',
                'arrays': '/arrays',
                'strings': '/string-manipulation',
                'sorting': '/sorting-algorithms',
                'stack-queue': '/stack-&-queue',
                'sliding-window-two-pointer': '/sliding-window-&-two-pointer',
                'heap-priority-queue': '/heaps-&-priority-queues',
                'binary-trees': '/binary-trees-&-bst',
                'recursion': '/recursion',
                'graphs': '/graphs-&-graph-algorithms',
                'dp': '/dynamic-programming',
                'dynamic-programming': '/dynamic-programming',
                'bit-manipulation': '/bit-manipulation',
              };
              const toPath = gameConfig?.path || fallbackPaths[topic.topicId] || `/${topic.name.toLowerCase().replace(/\s+/g, '-')}`;
              const totalLevels = progress?.levels?.length || 0;
              const completedLevels = progress?.levels?.filter(lvl => lvl.completed).length || 0;
              const percentComplete = totalLevels > 0 ? Math.round((completedLevels / totalLevels) * 100) : 0;

              return (
                <Link
                  key={topic._id}
                  to={toPath}
                  className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105 block relative group overflow-hidden"
                  onClick={(e) => {
                    // Check if it's a premium game and user doesn't have access
                    const isPremiumGame = (topic.topicId === 'binary-trees' || topic.topicId === 'binary-tree' || topic.topicId === 'graphs' || topic.topicId === 'graph');
                    const hasAccess = hasGameAccess(user, topic.topicId === 'binary-trees' || topic.topicId === 'binary-tree' ? 'binary-tree' : 'graph');
                    
                    if (isPremiumGame && !hasAccess) {
                      e.preventDefault();
                      // Store the intended game URL
                      const gameUrl = toPath.replace('/', '');
                      localStorage.setItem('intendedGame', gameUrl);
                      // Show message and redirect to premium purchase
                      alert('This is a premium game! Please purchase premium access to play.');
                      window.location.href = `/premium-purchase?game=${gameUrl}`;
                    }
                  }}
                >
                  {/* Coming Soon badge */}
                  {(topic.topicId === 'dp' || topic.topicId === 'dynamic-programming') && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-orange-500 to-red-500 text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg border-2 border-white/20">
                      Coming Soon
                    </div>
                  )}

                  {/* Premium badge */}
                  {(topic.topicId === 'binary-trees' || topic.topicId === 'binary-tree' || topic.topicId === 'graphs' || topic.topicId === 'graph') && (
                    <div className="absolute -top-2 -right-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg border-2 border-white/20">
                      {hasGameAccess(user, topic.topicId === 'binary-trees' || topic.topicId === 'binary-tree' ? 'binary-tree' : 'graph') ? 'Already Purchased' : 'PREMIUM'}
                    </div>
                  )}

                  {/* Gradient accent line */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500"></div>

                  {/* Title and Description */}
                  <div className="mb-6">
                    <h3 className="text-gray-800 font-bold text-xl mb-3 font-mono">{topic.name}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed font-mono">{topic.description}</p>
                  </div>

                  {/* Levels Progress */}
                  {progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1 font-mono">
                        <span>Levels</span>
                        <span>{completedLevels} / {totalLevels}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentComplete}%` }}
                        />
                      </div>
                    </div>
                  )}
                  {!progress && (
                    <div className="mb-4">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1 font-mono">
                        <span>Levels</span>
                        <span>{completedLevels} / 10 </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-gradient-to-r from-green-500 to-blue-500 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${percentComplete}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Status Badge */}
                  {progress && (
                    <div className="text-center">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold border font-mono ${
                        isCompleted || (currentTopicProgress?.totalScore >= 100) 
                          ? 'bg-green-100 text-green-700 border-green-200' 
                          : 'bg-yellow-100 text-yellow-700 border-yellow-200'
                      }`}>
                        {isCompleted || (currentTopicProgress?.totalScore >= 100) ? 'Completed' : 'In Progress'}
                      </span>
                    </div>
                  )}
                  {!progress && (
                    <div className="text-center">
                      <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold border border-gray-200 font-mono">
                        Not Started
                      </span>
                    </div>
                  )}

                  {/* Hover effect overlay */}
                  <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                </Link>
              );
            })}
            {Array.isArray(topics) && topics.length === 0 && !apiLoading && userProgress && userProgress.length === 0 && (
              <div className="col-span-full text-center py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📚</span>
                </div>
                <p className="text-gray-500 font-mono">No topics available at the moment.</p>
              </div>
            )}
            {Array.isArray(topics) && topics.length === 0 && !apiLoading && userProgress && userProgress.length > 0 && (
              <div className="col-span-full text-center py-8">
                <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-2 border-green-500 border-t-transparent"></div>
                </div>
                <p className="text-gray-500 font-mono">Loading topics...</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Games; 
