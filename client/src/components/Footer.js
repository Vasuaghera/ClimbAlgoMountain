import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    // TODO: Implement newsletter signup
    alert('Newsletter signup feature coming soon!');
    setEmail('');
  };

  return (
    <footer className="w-full bg-white text-gray-800 font-mono relative overflow-hidden">
      {/* Simple Border */}
      <div className="w-full h-1 bg-gray-200"></div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* Brand Section */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4">
              <h3 className="text-xl font-bold text-green-600 tracking-wider">DSA GAME</h3>
            </div>
            <p className="text-gray-600 text-sm mb-4 leading-relaxed">
              Master Data Structures & Algorithms through interactive games, challenges, and hands-on visualizations. 
              Join our community of problem solvers!
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-green-600 mb-4 tracking-wider">QUICK LINKS</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/games" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🎮</span>
                  All Games
                </Link>
              </li>
              <li>
                <Link to="/leaderboard" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🏆</span>
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link to="/rewards" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🎁</span>
                  Rewards
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">💬</span>
                  Q&A Community
                </Link>
              </li>
              <li>
                <Link to="/chatbot" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🤖</span>
                  AI Assistant
                </Link>
              </li>
              <li>
                <Link to="/friends" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">👥</span>
                  Friends
                </Link>
              </li>
            </ul>
          </div>

          {/* Game Categories */}
          <div>
            <h4 className="text-lg font-bold text-green-600 mb-4 tracking-wider">GAME CATEGORIES</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/arrays" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🔍</span>
                  Array Game
                </Link>
              </li>
              <li>
                <Link to="/string-manipulation" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">⚡</span>
                  String Programming
                </Link>
              </li>
              <li>
                <Link to="/sorting-algorithms" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🔄</span>
                  Sorting Master
                </Link>
              </li>
              <li>
                <Link to="/binary-trees-&-bst" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🌳</span>
                  Binary Tree Game
                </Link>
              </li>
              <li>
                <Link to="/graphs-&-graph-algorithms" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🌐</span>
                  Graph Algorithms
                </Link>
              </li>
              <li>
                <Link to="/recursion" className="text-gray-600 hover:text-green-600 transition-colors text-sm flex items-center">
                  <span className="mr-2">🔄</span>
                  Recursion Realm
                </Link>
              </li>
            </ul>
      </div>

          {/* Newsletter & Contact */}
      <div>
            <h4 className="text-lg font-bold text-green-600 mb-4 tracking-wider">STAY UPDATED</h4>
            <p className="text-gray-600 text-sm mb-4">
              Get the latest updates on new games, features, and DSA tips!
            </p>

            <div className="space-y-2 mt-10">
              <div className="flex items-center text-gray-600 text-sm">
                <span className="mr-2">📧</span>
                  dummymailchhebhai@gmail.com
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <span className="mr-2">🌐</span>
                https://climb-algo-mountain-v27d.vercel.app/login
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <span className="mr-2">📱</span>
                (+91) 12345-67890
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-300 mt-8 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="text-gray-500 text-sm mb-4 md:mb-0">
              &copy; {new Date().getFullYear()} DSA Game. All rights reserved. | 
              <Link to="/about" className="ml-2 hover:text-green-600 transition-colors">About Us</Link> | 
              <a href="#" className="ml-2 hover:text-green-600 transition-colors">Privacy Policy</a> | 
              <a href="#" className="ml-2 hover:text-green-600 transition-colors">Terms of Service</a>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-gray-500 text-sm">Made ❤️ for DSA enthusiasts</span>
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Border */}
      <div className="w-full h-1 bg-gray-200"></div>
  </footer>
);
};

export default Footer; 
