import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const PremiumPurchase = () => {
  const { user, refreshUserProfile } = useAuth();
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [purchaseMessage, setPurchaseMessage] = useState('');
  const [intendedGame, setIntendedGame] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Get intended game from URL params or localStorage
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const gameParam = params.get('game');
    const storedGame = localStorage.getItem('intendedGame');
    
    if (gameParam) {
      setIntendedGame(gameParam);
      localStorage.setItem('intendedGame', gameParam);
    } else if (storedGame) {
      setIntendedGame(storedGame);
    }
  }, [location]);

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
        key: process.env.REACT_APP_RAZORPAY_KEY_ID,
        amount: data.amount,
        currency: 'INR',
        name: 'DSA Game Premium',
        description: `Purchase ${product === 'tree' ? 'Tree' : product === 'graph' ? 'Graph' : 'Tree & Graph'} Premium`,
        order_id: data.orderId,
        handler: async function (response) {
          console.log('Razorpay handler called with:', response);
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
          console.log('Verify response:', verifyData);
          if (verifyData.userAccess) {
            if (user && user.premiumAccess) {
              user.premiumAccess = verifyData.userAccess;
            }
          }
          if (verifyData.success || verifyData.message?.toLowerCase().includes('verified')) {
            setPurchaseMessage('Payment successful! Premium access granted.');
            refreshUserProfile && refreshUserProfile();
            setTimeout(() => {
              setPurchaseMessage('');
              if (intendedGame) {
                let redirectUrl = '/';
                if (intendedGame === 'binary-tree') redirectUrl = '/binary-trees-&-bst';
                else if (intendedGame === 'graph') redirectUrl = '/graphs-&-graph-algorithms';
                else if (intendedGame === 'bundle') redirectUrl = '/binary-trees-&-bst';
                navigate(redirectUrl);
              }
            }, 3000);
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-xl">
              <span className="text-3xl">💎</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4 font-mono">
              Unlock Premium Games
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Master advanced DSA concepts with exclusive premium games and challenges
            </p>
            <Link
              to="/games"
              className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-gray-500 to-gray-600 hover:from-gray-600 hover:to-gray-700 text-white rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Games
            </Link>
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
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Premium Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Tree Premium Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500"></div>
              
              {/* Card content */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-3xl">🌳</span>
                </div>
                
                <h3 className="text-gray-800 font-bold text-2xl mb-4">Tree Premium</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  Master Binary Trees, BST, and advanced tree algorithms with interactive challenges and detailed explanations.
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-green-600">₹999</span>
                  <span className="text-gray-500 text-sm ml-2">one-time</span>
                </div>

                {/* Features */}
                <div className="mb-8 space-y-3">
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Binary Tree Traversals
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    BST Operations
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Advanced Tree Algorithms
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Interactive Visualizations
                  </div>
                </div>

                {hasGameAccess(user, 'binary-tree') ? (
                  <Link
                    to="/binary-trees-&-bst"
                    className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg block"
                  >
                    Start Learning
                  </Link>
                ) : (
                  <button
                    className="w-full bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={() => {
                      setIntendedGame('binary-tree');
                      localStorage.setItem('intendedGame', 'binary-tree');
                      handlePurchase('tree');
                    }}
                    disabled={purchaseLoading}
                  >
                    {purchaseLoading ? 'Processing...' : 'Buy Tree Premium'}
                  </button>
                )}
              </div>
            </div>

            {/* Bundle Premium Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500"></div>
              
              {/* Popular badge */}
              <div className="absolute top-4 right-4 bg-gradient-to-r from-yellow-500 to-orange-500 text-white text-sm font-bold px-4 py-2 rounded-full z-10 shadow-lg">
                MOST POPULAR
              </div>
              
              {/* Card content */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-3xl">🎁</span>
                </div>
                
                <h3 className="text-gray-800 font-bold text-2xl mb-4">Tree & Graph Bundle</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  Get both Tree and Graph premium access at a discounted price. Perfect for mastering advanced DSA concepts.
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-purple-600">₹1499</span>
                  <span className="text-gray-500 text-sm ml-2">one-time</span>
                  <div className="text-green-600 text-sm mt-1 font-semibold">Save ₹499</div>
                </div>

                {/* Features */}
                <div className="mb-8 space-y-3">
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    All Tree Premium Features
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    All Graph Premium Features
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Cross-Topic Challenges
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    Priority Support
                  </div>
                </div>

                {hasGameAccess(user, 'binary-tree') && hasGameAccess(user, 'graph') ? (
                  <Link
                    to="/binary-trees-&-bst"
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg block"
                  >
                    Start Learning
                  </Link>
                ) : (
                  <button
                    className="w-full bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 hover:from-purple-600 hover:via-pink-600 hover:to-red-600 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={() => {
                      setIntendedGame('bundle');
                      localStorage.setItem('intendedGame', 'bundle');
                      handlePurchase('both');
                    }}
                    disabled={purchaseLoading}
                  >
                    {purchaseLoading ? 'Processing...' : 'Buy Bundle'}
                  </button>
                )}
              </div>
            </div>

            {/* Graph Premium Card */}
            <div className="bg-white rounded-3xl border-2 border-gray-100 p-8 shadow-2xl hover:shadow-3xl transition-all duration-300 transform hover:scale-105 relative overflow-hidden">
              {/* Gradient accent */}
              <div className="absolute top-0 left-0 right-0 h-3 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500"></div>
              
              {/* Card content */}
              <div className="text-center">
                <div className="w-20 h-20 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <span className="text-3xl">🕸️</span>
                </div>
                
                <h3 className="text-gray-800 font-bold text-2xl mb-4">Graph Premium</h3>
                <p className="text-gray-600 mb-6 leading-relaxed text-lg">
                  Explore Graph Theory, algorithms, and network analysis with comprehensive tutorials and practice problems.
                </p>
                
                <div className="mb-6">
                  <span className="text-4xl font-bold text-blue-600">₹999</span>
                  <span className="text-gray-500 text-sm ml-2">one-time</span>
                </div>

                {/* Features */}
                <div className="mb-8 space-y-3">
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Graph Traversals (DFS/BFS)
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Shortest Path Algorithms
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Minimum Spanning Trees
                  </div>
                  <div className="flex items-center text-gray-700 text-base">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Network Analysis Tools
                  </div>
                </div>

                {hasGameAccess(user, 'graph') ? (
                  <Link
                    to="/graphs-&-graph-algorithms"
                    className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg block"
                  >
                    Start Learning
                  </Link>
                ) : (
                  <button
                    className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 text-white font-semibold px-6 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    onClick={() => {
                      setIntendedGame('graph');
                      localStorage.setItem('intendedGame', 'graph');
                      handlePurchase('graph');
                    }}
                    disabled={purchaseLoading}
                  >
                    {purchaseLoading ? 'Processing...' : 'Buy Graph Premium'}
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Message Display */}
          {purchaseMessage && (
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-8 py-4 bg-green-50 text-green-700 rounded-2xl border-2 border-green-200 shadow-lg">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <span className="font-semibold text-lg">{purchaseMessage}</span>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="text-center mt-12">
            <p className="text-gray-600 text-lg bg-gray-50 px-8 py-4 rounded-2xl border-2 border-gray-200 inline-block">
              All premium purchases include lifetime access and future updates
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumPurchase;