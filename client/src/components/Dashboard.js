import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import useApi from '../hooks/useApi';
import { useLoading } from '../hooks/useLoading';
import { Link } from 'react-router-dom';
import { DashboardLoading } from './Loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Dino SVG Frame 1 (legs down) - matches user's accepted dino style
const DinoFrame1 = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-auto drop-shadow-lg" shapeRendering="crispEdges">
    {/* Head */}
    <rect x="18" y="4" width="8" height="5" className="fill-black" />
    {/* Eye */}
    <rect x="22" y="6" width="1" height="1" className="fill-white" />
    {/* Neck line (horizontal) */}
    <rect x="18" y="10" width="8" height="1" className="fill-black" />
    {/* Body */}
    <rect x="10" y="9" width="12" height="7" className="fill-black" />
    <rect x="8" y="11" width="12" height="7" className="fill-black" />
    {/* Back */}
    <rect x="6" y="14" width="2" height="4" className="fill-black" />
    {/* Tail */}
    <rect x="2" y="17" width="4" height="2" className="fill-black" />
    <rect x="1" y="19" width="1" height="1" className="fill-black" />
    {/* Arm */}
    <rect x="16" y="16" width="2" height="1" className="fill-black" />
    {/* Leg 1 */}
    <rect x="10" y="18" width="2" height="6" className="fill-black" />
    {/* Leg 2 */}
    <rect x="14" y="18" width="2" height="6" className="fill-black" />
  </svg>
);

// Dino SVG Frame 2 (both legs up together, decrease from bottom)
const DinoFrame2 = () => (
  <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-32 h-auto drop-shadow-lg" shapeRendering="crispEdges">
    {/* Head */}
    <rect x="18" y="4" width="8" height="5" className="fill-black" />
    {/* Eye */}
    <rect x="22" y="6" width="1" height="1" className="fill-white" />
    {/* Neck line (horizontal) */}
    <rect x="18" y="10" width="8" height="1" className="fill-black" />
    {/* Body */}
    <rect x="10" y="9" width="12" height="7" className="fill-black" />
    <rect x="8" y="11" width="12" height="7" className="fill-black" />
    {/* Back */}
    <rect x="6" y="14" width="2" height="4" className="fill-black" />
    {/* Tail */}
    <rect x="2" y="17" width="4" height="2" className="fill-black" />
    <rect x="1" y="19" width="1" height="1" className="fill-black" />
    {/* Arm */}
    <rect x="16" y="16" width="2" height="1" className="fill-black" />
    {/* Leg 1 (up, decrease from bottom) */}
    <rect x="10" y="18" width="2" height="4" className="fill-black" />
    {/* Leg 2 (up, decrease from bottom) */}
    <rect x="14" y="18" width="2" height="4" className="fill-black" />
  </svg>
);

const Dashboard = () => {
  const { user } = useAuth();
  const [dinoX, setDinoX] = useState(0); // px
  const [frame, setFrame] = useState(0); // 0 or 1
  const heroRef = useRef(null);
  const { get } = useApi();
  const { isLoading, withMultipleLoading } = useLoading(true);
  const [overallScore, setOverallScore] = useState(0);
  const [gameProgress, setGameProgress] = useState([]);
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [streakData, setStreakData] = useState({
    currentStreak: 0,
    bestStreak: 0,
    completionRate: 0,
    weeklyActivity: [],
    nextGoal: 0
  });
  const [motivationalQuote, setMotivationalQuote] = useState({
    quote: "The only way to do great work is to love what you do.",
    author: "Steve Jobs"
  });
  const [rewards, setRewards] = useState([]);
  const [chatMessages, setChatMessages] = useState([
    { from: 'bot', text: "Hi! I'm your DSA tutor. How can I help you today?" }
  ]);
  const [chatInput, setChatInput] = useState('');
  const [chatLoading, setChatLoading] = useState(false);
  const TOTAL_SCORE = 1000;

  // Motivational quotes array
  const motivationalQuotes = [
    { quote: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
    { quote: "Success is not final, failure is not fatal: it is the courage to continue that counts.", author: "Winston Churchill" },
    { quote: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
    { quote: "Don't watch the clock; do what it does. Keep going.", author: "Sam Levenson" },
    { quote: "The only limit to our realization of tomorrow is our doubts of today.", author: "Franklin D. Roosevelt" },
    { quote: "It always seems impossible until it's done.", author: "Nelson Mandela" },
    { quote: "The way to get started is to quit talking and begin doing.", author: "Walt Disney" },
    { quote: "Believe you can and you're halfway there.", author: "Theodore Roosevelt" },
    { quote: "Your time is limited, don't waste it living someone else's life.", author: "Steve Jobs" },
    { quote: "The harder you work for something, the greater you'll feel when you achieve it.", author: "Unknown" }
  ];

  // Get random quote
  const getRandomQuote = () => {
    const randomIndex = Math.floor(Math.random() * motivationalQuotes.length);
    return motivationalQuotes[randomIndex];
  };

  // Calculate rewards based on score
  const calculateRewards = (score) => {
    const rewardTiers = [
      { id: 'tt_kit', name: 'TT Kit', icon: '🎁', score: 250, description: 'Bottle, T-shirt, Book', color: 'from-yellow-400 to-orange-500' },
      { id: 'ipad', name: 'iPad', icon: '📱', score: 500, description: 'Latest iPad Pro', color: 'from-blue-400 to-purple-500' },
      { id: 'laptop', name: 'Laptop', icon: '💻', score: 1000, description: 'Gaming Laptop', color: 'from-green-400 to-teal-500' }
    ];

    return rewardTiers.map(reward => ({
      ...reward,
      unlocked: score >= reward.score,
      progress: Math.min(100, (score / reward.score) * 100)
    }));
  };

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const progressData = await get(`${BACKEND_URL}/api/game-progress/all-progress`);
        if (progressData && Array.isArray(progressData.progress)) {
          const total = progressData.progress.reduce((sum, topic) => sum + (topic.totalScore || 0), 0);
          setOverallScore(total);
          setGameProgress(progressData.progress);
          // Calculate rewards based on total score
          setRewards(calculateRewards(total));
        } else {
          setOverallScore(0);
          setGameProgress([]);
          setRewards(calculateRewards(0));
        }
      } catch (err) {
        setOverallScore(0);
        setGameProgress([]);
        setRewards(calculateRewards(0));
      }
    };

    const fetchLeaderboard = async () => {
      try {
        const leaderboardResponse = await get(`${BACKEND_URL}/api/leaderboard`);
        if (leaderboardResponse && Array.isArray(leaderboardResponse.leaderboard)) {
          setLeaderboardData(leaderboardResponse.leaderboard.slice(0, 3)); // Get top 3
        } else {
          setLeaderboardData([]);
        }
      } catch (err) {
        setLeaderboardData([]);
      }
    };

    const fetchStreakData = async () => {
      try {
        const userResponse = await get(`${BACKEND_URL}/api/user/profile`);
        if (userResponse && userResponse.user) {
          const user = userResponse.user;
          setStreakData({
            currentStreak: user.currentStreak || 0,
            bestStreak: user.bestStreak || 0,
            completionRate: user.completionRate || 0,
            weeklyActivity: user.weeklyActivity || [],
            nextGoal: user.currentStreak ? Math.ceil(user.currentStreak * 1.5) : 7
          });
        } else {
          setStreakData({
            currentStreak: 0,
            bestStreak: 0,
            completionRate: 0,
            weeklyActivity: [],
            nextGoal: 7
          });
        }
      } catch (err) {
        setStreakData({
          currentStreak: 0,
          bestStreak: 0,
          completionRate: 0,
          weeklyActivity: [],
          nextGoal: 7
        });
      }
    };

    const recalculateUserLevel = async () => {
      try {
        // Silently recalculate user level to fix existing users
        await fetch(`${BACKEND_URL}/api/game-progress/recalculate-level`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
      } catch (err) {
        // Silently handle error - this is just for fixing existing users
        console.log('Level recalculation failed (this is normal for new users):', err);
      }
    };

    // Set random motivational quote
    setMotivationalQuote(getRandomQuote());

    // Fetch all data using the loading hook
    withMultipleLoading([
      fetchProgress(),
      fetchLeaderboard(),
      fetchStreakData(),
      recalculateUserLevel() // Add level recalculation
    ], 'Loading Your DSA Journey...');
  }, [get, withMultipleLoading]);

  // Helper function to get specific game progress
  const getGameProgress = (gameName) => {
    const game = gameProgress.find(g => g.topicId && g.topicId.toLowerCase().includes(gameName.toLowerCase()));
    return game || { totalScore: 0, completed: false, levels: [] };
  };

  // Helper function to get game status
  const getGameStatus = (progressPercentage) => {
    if (isNaN(progressPercentage) || progressPercentage === 0) return { status: 'Not Started', color: 'gray', dotColor: 'bg-gray-400' };
    if (progressPercentage === 100) return { status: 'Completed! 🎉', color: 'green', dotColor: 'bg-green-500' };
    return { status: 'In Progress', color: 'yellow', dotColor: 'bg-yellow-500' };
  };

  // Helper function to calculate progress percentage from levels
  const calculateProgressPercentage = (game) => {
    if (!game || !game.levels || !Array.isArray(game.levels) || game.levels.length === 0) {
      return 0;
    }
    const completedLevels = game.levels.filter(level => level.completed).length;
    const totalLevels = game.levels.length;
    return totalLevels === 0 ? 0 : Math.min(100, Math.round((completedLevels / totalLevels) * 100));
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

  // Animation loop
  useEffect(() => {
    let running = true;
    let lastTime = performance.now();
    let width = 0;
    if (heroRef.current) {
      width = heroRef.current.offsetWidth;
    }
    const speed = 120; // px per second
    function animate(time) {
      if (!running) return;
      const dt = (time - lastTime) / 1000;
      lastTime = time;
      setDinoX(prev => {
        let next = prev + speed * dt;
        if (heroRef.current) width = heroRef.current.offsetWidth;
        if (next > width - 80) return 0;
        return next;
      });
      requestAnimationFrame(animate);
    }
    const raf = requestAnimationFrame(animate);
    return () => { running = false; cancelAnimationFrame(raf); };
  }, []);

  // Frame toggle for running effect
  useEffect(() => {
    const interval = setInterval(() => {
      setFrame(f => (f === 0 ? 1 : 0));
    }, 120);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start font-mono relative overflow-hidden">
      {/* Loading Animation */}
      {isLoading && (
        <DashboardLoading />
      )}
      
      {/* CSS Animation for gradient shift */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
      
      {/* Hero Content */}
      <div ref={heroRef} className="w-full pt-40 flex flex-col items-center justify-center z-10 pb-8 relative bg-gradient-to-b from-green-200 via-green-100 via-green-50 to-white">
        <div className="flex items-end justify-center -mb-10 w-full gap-20 relative" style={{ minHeight: 140 }}>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              transform: `translateX(${dinoX}px)`,
              transition: 'transform 0.1s',
              zIndex: 2,
            }}
          >
            {frame === 0 ? <DinoFrame1 /> : <DinoFrame2 />}
          </div>
        </div>
        {/* Ground line */}
        <div className="relative w-screen">
        <svg
          width="100vw"
          height="24"
          viewBox="0 0 1000 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-screen block"
          style={{ width: '100vw', height: 24, display: 'block', margin: 0, padding: 0 }}
          shapeRendering="crispEdges"
          preserveAspectRatio="none"
        >
          <polyline
            points="0,12 20,12 24,10 36,10 40,12 60,12 64,14 76,14 80,12 120,12 124,16 140,16 144,12 180,12 184,10 196,10 200,12 240,12 244,14 256,14 260,12 300,12 304,10 316,10 320,12 360,12 364,16 380,16 384,12 420,12 424,10 436,10 440,12 480,12 484,14 496,14 500,12 540,12 544,16 560,16 564,12 600,12 604,10 616,10 620,12 660,12 664,14 676,14 680,12 720,12 724,16 740,16 744,12 780,12 784,10 796,10 800,12 840,12 844,14 856,14 860,12 900,12 904,16 920,16 924,12 960,12 964,10 976,10 980,12 1000,12"
              stroke="#16a34a"
            strokeWidth="6"
            fill="none"
          />
            <rect x="70" y="18" width="8" height="2" className="fill-black" />
            <rect x="240" y="20" width="4" height="2" className="fill-black" />
            <rect x="440" y="18" width="6" height="2" className="fill-black" />
            <rect x="640" y="20" width="4" height="2" className="fill-black" />
            <rect x="840" y="18" width="8" height="2" className="fill-black" />
            <rect x="950" y="20" width="4" height="2" className="fill-black" />
        </svg>
      </div>
        {/* Title and subtitle */}
        <h1 className="text-3xl md:text-4xl mt-10 mb-10 tracking-widest font-mono text-green-600">
          {user ? <span className="font-bold">Hi, {user.username}!</span> : ''} 
        </h1>
        <p className="text-gray-700 text-lg md:text-xl mb-10 text-center font-mono">
          Master DSA concepts and problem-solving through interactive games, challenges, and hands-on visualizations.<br />
          Track your progress, climb the leaderboard, and join a vibrant DSA community—all in a fun, retro style!
        </p>
        <a
          href="http://localhost:3000/games"
          className="group relative inline-flex items-center justify-center px-12 py-4 text-xl font-bold text-white bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 rounded-2xl shadow-2xl hover:shadow-3xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 font-mono tracking-widest overflow-hidden border-2 border-white/20"
          style={{
            background: 'linear-gradient(45deg, #16a34a 0%, #22c55e 25%, #3b82f6 50%, #1d4ed8 75%, #1e40af 100%)',
            backgroundSize: '300% 300%',
            animation: 'gradientShift 3s ease infinite',
            boxShadow: '0 20px 40px rgba(34, 197, 94, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
          }}
        >
          {/* Animated background overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
          
          {/* Glowing effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-400/30 via-blue-400/30 to-purple-400/30 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500"></div>
          
          {/* Button content */}
          <div className="relative flex items-center space-x-3 z-10">
            <span className="text-2xl animate-bounce">🎮</span>
            <span className="relative">
          START GAME
              <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-white group-hover:w-full transition-all duration-300"></div>
            </span>
            <span className="text-2xl animate-pulse">⚡</span>
          </div>
          
          {/* Sparkle effects */}
          <div className="absolute -top-2 -left-2 w-4 h-4 bg-yellow-400 rounded-full animate-ping opacity-75"></div>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-pink-400 rounded-full animate-ping opacity-75" style={{animationDelay: '0.5s'}}></div>
          <div className="absolute -bottom-1 left-4 w-2 h-2 bg-blue-400 rounded-full animate-ping opacity-75" style={{animationDelay: '1s'}}></div>
        </a>
      </div>
      
      {/* Progress Bar Section */}
      <div className="w-full bg-gradient-to-r from-pink-50 via-white to-blue-50 py-20 relative">
        <ArrayDecoration position="left-8" />
        <TreeDecoration position="right-8" />
        <div className="w-full max-w-xl mx-auto">
          <div className="mb-6 text-center">
            <span className="text-xl font-mono font-extrabold text-green-600 tracking-wide uppercase">Your Progress</span>
          </div>
          <div className="relative w-full h-14 bg-white border-4 border-green-200 rounded-full shadow-lg overflow-hidden">
            <div
              className="absolute left-0 top-0 h-full rounded-full transition-all animate-pulse"
              style={{
                width: `${Math.min(100, (overallScore / TOTAL_SCORE) * 100)}%`,
                background: 'linear-gradient(90deg, #22c55e 0%, #3b82f6 50%, #8b5cf6 100%)',
                boxShadow: '0 0 32px 8px #22c55e88, 0 2px 16px 0 #3b82f688',
                filter: 'brightness(1.1) saturate(1.2)',
              }}
            ></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono font-extrabold text-2xl text-gray-800 drop-shadow-lg">
                {Math.round((overallScore / TOTAL_SCORE) * 100)}%
              </span>
            </div>
          </div>
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm font-mono text-gray-500">0</span>
            <span className="text-sm font-mono text-gray-500">{TOTAL_SCORE}</span>
          </div>
        </div>
      </div>
      
      {/* Quick Access to Top Games */}
      <div className="w-full bg-gradient-to-br from-white via-purple-50 to-pink-50 py-16 relative">
        <LinkedListDecoration position="left-8" />
        <StackDecoration position="right-8" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              QUICK ACCESS TO TOP GAMES
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Master the most essential DSA concepts through interactive games
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Array Game */}
            <Link to="/arrays" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-yellow-200 group cursor-pointer block hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">AR</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">{getGameProgress('arrays').totalScore || 0}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
              
              <h3 className="text-gray-800 font-bold text-lg mb-2">Array Operations</h3>
              <p className="text-yellow-600 text-sm font-semibold mb-4">BASIC</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{isNaN(calculateProgressPercentage(getGameProgress('arrays'))) ? '0' : Math.round(calculateProgressPercentage(getGameProgress('arrays')))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-yellow-500 to-orange-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${isNaN(calculateProgressPercentage(getGameProgress('arrays'))) ? 0 : calculateProgressPercentage(getGameProgress('arrays'))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${getGameStatus(calculateProgressPercentage(getGameProgress('arrays'))).dotColor} rounded-full animate-pulse`}></div>
                  <span className={`text-xs font-semibold text-${getGameStatus(calculateProgressPercentage(getGameProgress('arrays'))).color}-600`}>
                    {getGameStatus(calculateProgressPercentage(getGameProgress('arrays'))).status}
                  </span>
                </div>
                <div className={`bg-gradient-to-r ${calculateProgressPercentage(getGameProgress('arrays')) === 100 ? 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600'} text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300`}>
                  {calculateProgressPercentage(getGameProgress('arrays')) === 100 ? 'Play Again' : 'Start'}
                </div>
              </div>
            </Link>

            {/* Sorting Game */}
            <Link to="/sorting-algorithms" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-cyan-200 group cursor-pointer block hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">SG</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">{getGameProgress('sorting-algorithms').totalScore || 0}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
              
              <h3 className="text-gray-800 font-bold text-lg mb-2">Sorting Master</h3>
              <p className="text-cyan-600 text-sm font-semibold mb-4">MEDIUM</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{isNaN(calculateProgressPercentage(getGameProgress('sorting'))) ? '0' : Math.round(calculateProgressPercentage(getGameProgress('sorting')))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-cyan-500 to-blue-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${isNaN(calculateProgressPercentage(getGameProgress('sorting'))) ? 0 : calculateProgressPercentage(getGameProgress('sorting'))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${getGameStatus(calculateProgressPercentage(getGameProgress('sorting'))).dotColor} rounded-full animate-pulse`}></div>
                  <span className={`text-xs font-semibold text-${getGameStatus(calculateProgressPercentage(getGameProgress('sorting'))).color}-600`}>
                    {getGameStatus(calculateProgressPercentage(getGameProgress('sorting'))).status}
                  </span>
                </div>
                <div className={`bg-gradient-to-r ${calculateProgressPercentage(getGameProgress('sorting')) === 100 ? 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600'} text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300`}>
                  {calculateProgressPercentage(getGameProgress('sorting')) === 100 ? 'Play Again' : 'Start'}
                </div>
              </div>
            </Link>

            {/* Recursion Game */}
            <Link to="/recursion" className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-red-200 group cursor-pointer block hover:scale-105">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-500 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-lg">RC</span>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-gray-800">{getGameProgress('recursion').totalScore || 0}</div>
                  <div className="text-xs text-gray-500">points</div>
                </div>
              </div>
              
              <h3 className="text-gray-800 font-bold text-lg mb-2">Recursion</h3>
              <p className="text-red-600 text-sm font-semibold mb-4">ADVANCED</p>
              
              <div className="mb-4">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>Progress</span>
                  <span>{isNaN(calculateProgressPercentage(getGameProgress('recursion'))) ? '0' : Math.round(calculateProgressPercentage(getGameProgress('recursion')))}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-red-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${isNaN(calculateProgressPercentage(getGameProgress('recursion'))) ? 0 : calculateProgressPercentage(getGameProgress('recursion'))}%` }}
                  ></div>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${getGameStatus(calculateProgressPercentage(getGameProgress('recursion'))).dotColor} rounded-full animate-pulse`}></div>
                  <span className={`text-xs font-semibold text-${getGameStatus(calculateProgressPercentage(getGameProgress('recursion'))).color}-600`}>
                    {getGameStatus(calculateProgressPercentage(getGameProgress('recursion'))).status}
                  </span>
                </div>
                <div className={`bg-gradient-to-r ${calculateProgressPercentage(getGameProgress('recursion')) === 100 ? 'from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600' : 'from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600'} text-white px-3 py-1.5 rounded-lg text-sm font-semibold transition-all duration-300`}>
                  {calculateProgressPercentage(getGameProgress('recursion')) === 100 ? 'Play Again' : 'Start'}
                </div>
              </div>
            </Link>
          </div>
        </div>
      </div>
      
      {/* Top Contestants & Daily Streak Section */}
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 relative">
        <QueueDecoration position="left-8" />
        <ArrayDecoration position="right-8" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              LEADERBOARD & STREAKS
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Compete with top players and maintain your daily learning streak
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top 3 Contestants */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-gray-800 font-bold text-xl font-mono">🏆 TOP CONTESTANTS</h3>
                  <span className="text-blue-600 text-sm font-mono font-semibold">This Week</span>
                </div>
                
                <div className="space-y-4">
                  {/* 1st Place */}
                  {leaderboardData.length > 0 && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl border border-yellow-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-orange-500 rounded-full flex items-center justify-center text-white font-bold text-lg">1</div>
                        <div>
                          <div className="text-gray-800 font-bold font-mono">{leaderboardData[0]?.username || 'Player 1'}</div>
                          <div className="text-gray-600 text-sm font-mono">{leaderboardData[0]?.title || 'DSA Master'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800 font-mono">{leaderboardData[0]?.score || 0}</div>
                        <div className="text-xs text-gray-500 font-mono">points</div>
                      </div>
                    </div>
                  )}

                  {/* 2nd Place */}
                  {leaderboardData.length > 1 && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl border border-gray-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-500 to-blue-500 rounded-full flex items-center justify-center text-white font-bold text-lg">2</div>
                        <div>
                          <div className="text-gray-800 font-bold font-mono">{leaderboardData[1]?.username || 'Player 2'}</div>
                          <div className="text-gray-600 text-sm font-mono">{leaderboardData[1]?.title || 'Algorithm Expert'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800 font-mono">{leaderboardData[1]?.score || 0}</div>
                        <div className="text-xs text-gray-500 font-mono">points</div>
                      </div>
                    </div>
                  )}

                  {/* 3rd Place */}
                  {leaderboardData.length > 2 && (
                    <div className="flex items-center justify-between p-4 bg-gradient-to-r from-orange-50 to-red-50 rounded-xl border border-orange-200">
                      <div className="flex items-center space-x-4">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg">3</div>
                        <div>
                          <div className="text-gray-800 font-bold font-mono">{leaderboardData[2]?.username || 'Player 3'}</div>
                          <div className="text-gray-600 text-sm font-mono">{leaderboardData[2]?.title || 'Code Warrior'}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xl font-bold text-gray-800 font-mono">{leaderboardData[2]?.score || 0}</div>
                        <div className="text-xs text-gray-500 font-mono">points</div>
                      </div>
                    </div>
                  )}

                  {/* No data state */}
                  {leaderboardData.length === 0 && (
                    <div className="text-center py-8">
                      <div className="text-gray-500 text-sm font-mono">No leaderboard data available</div>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-6 text-center">
                <Link to="/leaderboard" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-6 py-2 rounded-lg text-sm font-mono font-semibold transition-all duration-300">
                  View Full Leaderboard
                </Link>
              </div>
            </div>

            {/* Daily Streak */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-gray-800 font-bold text-xl font-mono">🔥 DAILY STREAK</h3>
                <span className="text-pink-600 text-sm font-mono font-semibold">Current</span>
              </div>
              
              <div className="text-center mb-8">
                <div className="text-6xl font-bold text-pink-600 font-mono mb-2">{streakData.currentStreak}</div>
                <div className="text-gray-800 text-lg font-mono font-semibold">Days in a Row</div>
                <div className="text-gray-600 text-sm font-mono">Keep the momentum going!</div>
              </div>

              <div className="mb-6">
                <div className="text-sm font-mono text-gray-600 mb-3">This Week's Activity</div>
                {/* Calculate current day index (Monday = 0, Sunday = 6) and rotate weeklyActivity if needed */}
                {(() => {
                  const today = new Date();
                  let currentDayIndex = today.getDay(); // 0 (Sun) - 6 (Sat)
                  currentDayIndex = (currentDayIndex + 6) % 7; // 0 (Mon) - 6 (Sun)
                  const weekDays = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
                  // Rotate weeklyActivity if backend sends [Sun, Mon, ..., Sat]
                  const backendWeeklyActivity = streakData.weeklyActivity || [];
                  const weeklyActivityMondayStart = backendWeeklyActivity.length === 7
                    ? [...backendWeeklyActivity.slice(1), backendWeeklyActivity[0]]
                    : backendWeeklyActivity;
                  return (
                    <div className="grid grid-cols-7 gap-2">
                      {weekDays.map((day, index) => (
                        <div key={day} className="text-center">
                          <div className={`text-xs font-mono mb-1 ${
                            index === currentDayIndex ? 'text-pink-700 font-bold' : 'text-gray-500'
                          }`}>{day}</div>
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-mono ${
                            weeklyActivityMondayStart[index] ? 'bg-gradient-to-br from-pink-500 to-red-500 text-white' : 'bg-gray-200 text-gray-500'
                          } ${index === currentDayIndex ? 'ring-2 ring-pink-400' : ''}`}>
                            {weeklyActivityMondayStart[index] ? '✓' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  );
                })()}
              </div>

              <div className="text-center p-4 bg-gradient-to-r from-pink-50 to-red-50 rounded-lg border border-pink-200">
                <div className="text-sm font-mono text-pink-600 font-semibold mb-1">
                  🎯 Next Goal: {streakData.nextGoal} Days
                </div>
                <div className="text-xs text-gray-600 font-mono">
                  {Math.max(0, streakData.nextGoal - streakData.currentStreak)} more days to reach your next milestone!
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Motivational Quote Section */}
      <div className="w-full bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 py-12 relative">
        <TreeDecoration position="left-8" />
        <LinkedListDecoration position="right-8" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-4xl mb-4">💡</div>
            <blockquote className="text-2xl md:text-3xl font-mono text-gray-800 mb-4 italic">
              "{motivationalQuote.quote}"
            </blockquote>
            <cite className="text-lg text-purple-600 font-mono font-semibold">
              — {motivationalQuote.author}
            </cite>
          </div>
        </div>
      </div>

      {/* Enhanced Rewards Section */}
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 relative">
        <StackDecoration position="left-8" />
        <QueueDecoration position="right-8" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              🏆 YOUR REWARDS
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Unlock amazing rewards as you progress through your DSA journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {rewards.map((reward, index) => (
              <div key={reward.id} className={`relative overflow-hidden rounded-2xl shadow-lg transition-all duration-300 hover:scale-105 ${
                reward.unlocked 
                  ? 'bg-white border-2 border-green-200 shadow-xl' 
                  : 'bg-white border-2 border-gray-200 shadow-lg'
              }`}>
                
                {!reward.unlocked && (
                  <div className="absolute inset-0 bg-gray-100 bg-opacity-80 flex items-center justify-center z-10 rounded-2xl">
                    <div className="text-gray-400 text-6xl">🔒</div>
                  </div>
                )}
                
                <div className="p-8 text-center relative">
                  {/* Reward Icon with better styling */}
                  <div className={`w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center text-4xl shadow-lg ${
                    reward.unlocked 
                      ? 'bg-gradient-to-br from-green-500 to-blue-600 shadow-green-200' 
                      : 'bg-gradient-to-br from-gray-300 to-gray-400'
                  }`}>
                    {reward.icon}
                  </div>
                  
                  {/* Reward Title */}
                  <h3 className={`text-2xl font-bold font-mono mb-3 ${
                    reward.unlocked ? 'text-gray-800' : 'text-gray-500'
                  }`}>
                    {reward.name}
                  </h3>
                  
                  {/* Reward Description */}
                  <p className={`text-sm mb-6 px-4 ${
                    reward.unlocked ? 'text-gray-600' : 'text-gray-400'
                  }`}>
                    {reward.description}
                  </p>
                  
                  {/* Progress Section */}
                  <div className="mb-6">
                    <div className="flex justify-between text-sm mb-2">
                      <span className={reward.unlocked ? 'text-gray-600' : 'text-gray-400'}>
                        Progress
                      </span>
                      <span className={`font-semibold ${
                        reward.unlocked ? 'text-green-600' : 'text-gray-400'
                      }`}>
                        {Math.round(reward.progress)}%
                      </span>
                    </div>
                    
                    {/* Progress Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div 
                        className={`h-3 rounded-full transition-all duration-1000 ${
                          reward.unlocked 
                            ? 'bg-gradient-to-r from-green-500 to-blue-600' 
                            : 'bg-gradient-to-r from-gray-300 to-gray-400'
                        }`}
                        style={{ width: `${reward.progress}%` }}
                      ></div>
                    </div>
                    
                    {/* Score Display */}
                    <div className="mt-2 text-xs text-gray-500">
                      {overallScore} / {reward.score} points
                    </div>
                  </div>
                  
                  {/* Status Badge */}
                  <div className={`inline-block px-4 py-2 rounded-full text-sm font-mono font-semibold ${
                    reward.unlocked 
                      ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white shadow-lg' 
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    {reward.unlocked ? '🎉 UNLOCKED!' : `${reward.score - overallScore} points needed`}
                  </div>
                </div>
              </div>
            ))}
            </div>
          
          <div className="text-center mt-8">
            <Link to="/rewards" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-mono font-semibold transition-all duration-300 shadow-lg">
              View All Rewards
            </Link>
          </div>
        </div>
      </div>
      
      {/* Q&A & Chatbot Section */}
      <div className="w-full bg-gradient-to-br from-white via-pink-50 to-purple-50 py-16 relative">
        <ArrayDecoration position="left-8" />
        <TreeDecoration position="right-8" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              🤖 Q&A & AI ASSISTANT
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Get help with DSA concepts and coding problems
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Q&A Section */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-blue-200">
              <div className="text-center">
                <div className="text-6xl mb-4">💡</div>
                <h3 className="text-gray-800 font-bold text-xl font-mono mb-3">Community Q&A</h3>
                <p className="text-gray-600 text-sm font-mono mb-6">
                  Ask questions, share solutions, and learn from the DSA community. Browse through existing questions or post your own.
                </p>
                <Link to="/forum" className="inline-block bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-mono font-semibold transition-all duration-300 shadow-lg">
                  Join Q&A Community
                </Link>
              </div>
            </div>

            {/* AI Chatbot */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border border-pink-200">
              <div className="text-center">
                <div className="text-6xl mb-4">🤖</div>
                <h3 className="text-gray-800 font-bold text-xl font-mono mb-3">AI Assistant</h3>
                <p className="text-gray-600 text-sm font-mono mb-6">
                  Get instant help with DSA concepts. Ask our AI assistant anything about algorithms, data structures, and coding problems.
                </p>
                <Link to="/chatbot" className="inline-block bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white px-8 py-3 rounded-lg text-lg font-mono font-semibold transition-all duration-300 shadow-lg">
                  Start Chatting
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard; 
