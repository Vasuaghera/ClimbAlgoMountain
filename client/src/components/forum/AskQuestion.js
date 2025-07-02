import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QALoading } from '../Loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// DSA-themed decorative components
const ArrayDecoration = ({ position }) => (
  <div className={`absolute ${position} opacity-80 pointer-events-none`}>
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((item) => (
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

const AskQuestion = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [charCount, setCharCount] = useState({ title: 0, body: 0 });
  const navigate = useNavigate();

  const handleTitleChange = (e) => {
    const value = e.target.value;
    setTitle(value);
    setCharCount(prev => ({ ...prev, title: value.length }));
  };

  const handleBodyChange = (e) => {
    const value = e.target.value;
    setBody(value);
    setCharCount(prev => ({ ...prev, body: value.length }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/api/forum/questions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ title, body }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to post question');
      }
      navigate('/forum');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const categories = [
    { id: 'algorithms', name: 'Algorithms', icon: '⚡' },
    { id: 'data-structures', name: 'Data Structures', icon: '🏗️' },
    { id: 'complexity', name: 'Time/Space Complexity', icon: '⏱️' },
    { id: 'implementation', name: 'Implementation', icon: '💻' },
    { id: 'concepts', name: 'General Concepts', icon: '🧠' },
    { id: 'other', name: 'Other', icon: '❓' }
  ];

  if (loading) {
    return <QALoading />;
  }

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-start font-mono relative overflow-hidden">
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
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-2xl mb-6 shadow-xl">
              <span className="text-3xl">❓</span>
            </div>
            <h1 className="text-5xl font-bold text-gray-800 mb-4 font-mono">
              Ask a Question
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Share your DSA doubts with the community and get expert help from fellow learners
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
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Main Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6">
              <h2 className="text-2xl font-bold text-white font-mono">Question Form</h2>
              <p className="text-green-100 mt-1">Fill in the details below to post your question</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8">
              {/* Title Section */}
              <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-4 text-lg">
                  Question Title
                </label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 text-lg shadow-sm"
                    value={title}
                    onChange={handleTitleChange}
                    required
                    maxLength={120}
                    placeholder="What's your question about?"
                  />
                  <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                    <span className={`text-sm font-mono ${
                      charCount.title > 100 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {charCount.title}/120
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-3 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Be specific and clear about your question
                </p>
              </div>

              {/* Body Section */}
              <div className="mb-8">
                <label className="block text-gray-700 font-bold mb-4 text-lg">
                  Question Details
                </label>
                <div className="relative">
                  <textarea
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-500 transition-all duration-300 resize-none shadow-sm"
                    value={body}
                    onChange={handleBodyChange}
                    required
                    rows={10}
                    maxLength={2000}
                    placeholder="Describe your question in detail. You can include code examples, specific scenarios, or any context that will help others understand your problem better."
                  />
                  <div className="absolute bottom-4 right-4">
                    <span className={`text-sm font-mono ${
                      charCount.body > 1800 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {charCount.body}/2000
                    </span>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Include code examples if relevant</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Be specific about your problem</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Show what you've tried so far</span>
                  </div>
                </div>
              </div>

              {/* Error Display */}
              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-red-700 font-medium">{error}</span>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-8 border-t-2 border-gray-100">
                <button
                  type="button"
                  onClick={() => navigate('/forum')}
                  className="px-8 py-4 text-gray-600 hover:text-gray-800 font-semibold transition-all duration-300 hover:bg-gray-100 rounded-2xl"
                >
                  ← Back to Q&A
                </button>
                <button
                  type="submit"
                  className={`px-10 py-4 rounded-2xl font-bold font-mono transition-all duration-300 transform hover:scale-105 shadow-lg ${
                    loading || !title.trim() || !body.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 hover:shadow-xl'
                  }`}
                  disabled={loading || !title.trim() || !body.trim()}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                      Posting Question...
                    </div>
                  ) : (
                    'Post Question'
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Tips Section */}
          <div className="mt-12 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 rounded-3xl shadow-xl border border-blue-100 p-8">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <span className="mr-3 text-3xl">💡</span>
              Tips for a Great Question
            </h3>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">1</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Be Specific</h4>
                  <p className="text-gray-600">Include details about what you're trying to achieve and what you've tried so far.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">2</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Include Code</h4>
                  <p className="text-gray-600">Share relevant code snippets to help others understand your implementation.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">3</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Show Effort</h4>
                  <p className="text-gray-600">Demonstrate that you've researched and attempted to solve the problem.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-white text-sm font-bold">4</span>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800 mb-2">Use Clear Title</h4>
                  <p className="text-gray-600">Make your title descriptive so others can quickly understand your question.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AskQuestion;
