import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import GameDecorations from './GameDecorations';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const ComingSoon = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-900 to-blue-900 p-4 relative">
      <div className="absolute inset-0 pointer-events-none">
        <GameDecorations />
      </div>
      <div className="z-10 flex flex-col items-center w-full">
        <div className="text-7xl mb-6 animate-bounce drop-shadow-lg">🧙‍♂️</div>
        <div className="bg-white/90 rounded-2xl shadow-2xl px-8 py-10 max-w-xl flex flex-col items-center">
          <h1 className="text-4xl md:text-5xl font-extrabold text-purple-700 mb-2 text-center drop-shadow">Dynamic Programming Game</h1>
          <div className="text-xl md:text-2xl text-blue-700 mb-4 text-center font-semibold">Coming Soon!</div>
          <div className="max-w-lg text-center text-gray-700 mb-6">
            <p className="mb-2">
              Get ready for an epic adventure in Dynamic Programming! 🚀<br/>
              Solve puzzles, master optimization, and level up your problem-solving skills.
            </p>
            <p className="text-purple-700 font-semibold">Stay tuned for new levels and challenges!</p>
          </div>
          <div className="flex gap-3 mb-6">
            <span className="bg-purple-100 text-purple-700 px-4 py-2 rounded-full font-bold shadow">Memoization</span>
            <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold shadow">Tabulation</span>
            <span className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full font-bold shadow">Optimization</span>
          </div>
          <button
            className="mt-2 px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold text-xl hover:bg-blue-700 transition-colors shadow-lg"
            onClick={() => navigate('/dashboard')}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;