import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const NotFound = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen pt-24 bg-white flex flex-col items-center justify-center font-mono relative overflow-hidden">
      {/* CSS Animation for gradient shift */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-50 via-blue-50 to-purple-50"></div>
      
      {/* Decorative elements */}
      <div className="absolute top-20 left-20 text-gray-600 text-6xl opacity-20 animate-bounce">🔍</div>
      <div className="absolute top-40 right-32 text-gray-600 text-4xl opacity-20 animate-pulse">❓</div>
      <div className="absolute bottom-40 left-32 text-gray-600 text-5xl opacity-20 animate-bounce" style={{animationDelay: '1s'}}>🚀</div>
      <div className="absolute bottom-20 right-20 text-gray-600 text-6xl opacity-20 animate-pulse" style={{animationDelay: '0.5s'}}>🏠</div>

      {/* Main Content */}
      <div className="relative z-10 text-center max-w-2xl mx-auto px-6">
        {/* Error Icon with spinning animation */}
        <div className="mb-8">
          <div className="relative inline-block">
            <div className="w-32 h-32 bg-gradient-to-br from-red-500 to-pink-600 rounded-full flex items-center justify-center shadow-2xl mb-6 animate-pulse">
              <span className="text-6xl">404</span>
            </div>
            {/* Spinning border effect */}
            <div className="absolute inset-0 w-32 h-32 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>
          </div>
        </div>

        {/* Error Message */}
        <h1 className="text-4xl md:text-6xl font-bold mb-6 font-mono tracking-wider text-green-600">
          PAGE NOT FOUND
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-700 mb-4 font-mono">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        <p className="text-lg text-gray-600 mb-12 font-mono">
          Don't worry, let's get you back on track to continue your DSA journey!
        </p>

        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
          {/* Go to Home Button */}
          <Link
            to="/"
            className="group relative inline-flex items-center justify-center px-8 py-4 text-xl font-bold text-green-600 bg-white border-2 border-green-600 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 hover:-translate-y-1 transition-all duration-500 font-mono tracking-widest overflow-hidden hover:bg-green-50"
          >
            {/* Button content */}
            <div className="relative flex items-center space-x-3 z-10">
              <span className="text-2xl">🏠</span>
              <span className="relative">
                GO TO HOME
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></div>
              </span>
              <span className="text-2xl">🎮</span>
            </div>
          </Link>
        </div>

        {/* Additional Help Section */}
        <div className="mt-16 p-8 bg-white rounded-2xl shadow-lg border border-green-200 max-w-lg mx-auto">
          <div className="text-center">
            <div className="text-4xl mb-4">💡</div>
            <h3 className="text-lg font-bold text-gray-800 mb-3 font-mono">Need Help?</h3>
            <p className="text-gray-600 text-sm font-mono mb-4">
              If you're having trouble finding what you're looking for, try these options:
            </p>
            <div className="space-y-2 text-sm text-gray-600 font-mono">
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span>Check the navigation menu</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                <span>Use the search function</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                <span>Contact support if needed</span>
              </div>
            </div>
          </div>
        </div>

        {/* User-specific message */}
        {user && (
          <div className="mt-8 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl border border-green-200">
            <p className="text-green-700 font-mono">
              Welcome back, <span className="font-bold">{user.username}</span>! 
              Let's get you back to your DSA learning journey.
            </p>
          </div>
        )}
      </div>

      {/* Bottom decorative elements */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex space-x-4 opacity-30">
        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
        <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
      </div>
    </div>
  );
};

export default NotFound; 