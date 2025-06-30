import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const ForumHome = () => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [sortBy, setSortBy] = useState('recent');
  const navigate = useNavigate();

  // DSA Decorative Components
  const ArrayDecoration = ({ position }) => (
    <div className={`absolute ${position} opacity-80 pointer-events-none`}>
      <div className="flex space-x-1">
        {[1, 2, 3].map((item) => (
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
  

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const res = await fetch('/api/forum/questions');
        const data = await res.json();
        setQuestions(data.questions || []);
      } catch (err) {
        setError('Failed to load questions');
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  const getFilteredAndSortedQuestions = () => {
    let filtered = questions;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(q => 
        q.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.body.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Sort questions
    switch (sortBy) {
      case 'recent':
        filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        break;
      case 'oldest':
        filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
        break;
      case 'mostAnswers':
        filtered.sort((a, b) => (b.answers?.length || 0) - (a.answers?.length || 0));
        break;
      case 'title':
        filtered.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return filtered;
  };

  const filteredQuestions = getFilteredAndSortedQuestions();

  if (loading) {
    return (
      <div className="min-h-screen pt-24 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl shadow-lg mb-6">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent"></div>
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Loading Community Questions</h3>
          <p className="text-green-600">Fetching the latest discussions...</p>
        </div>
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
          <h2 className="text-lg font-bold text-gray-800 mb-2 font-mono">Error Loading Q&A</h2>
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl hover:from-green-600 hover:to-blue-700 transition-all duration-200 font-bold font-mono shadow-lg"
          >
            Try Again
          </button>
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
        {/* Decorative DSA elements */}
        {/* <ArrayDecoration position="top-10 left-10" />
        <TreeDecoration position="top-20 right-20" /> */}
        <LinkedListDecoration position="bottom-10 left-20" />
        <StackDecoration position="bottom-20 right-10" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6 shadow-xl">
            <span className="text-4xl">💬</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-wider text-green-600">
            COMMUNITY Q&A
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-mono">
            Connect with fellow DSA learners, ask questions, and share your knowledge
          </p>
        </div>
      </div>

      {/* Search and Filters Section */}
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 relative">
        {/* Decorative DSA elements */}
        <QueueDecoration position="top-10 left-10" />
        <ArrayDecoration position="top-20 right-20" />
        {/* <TreeDecoration position="bottom-10 left-20" />
        <LinkedListDecoration position="bottom-20 right-10" /> */}
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
            <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
              <div className="flex-1 w-full lg:w-auto">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search questions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-3 pl-12 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-mono"
                  />
                  <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
              </div>
              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-3 bg-gray-50 border-2 border-gray-200 rounded-xl text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-mono"
                >
                  <option value="recent">Most Recent</option>
                  <option value="oldest">Oldest First</option>
                  <option value="mostAnswers">Most Answers</option>
                  <option value="title">Alphabetical</option>
                </select>
                <button
                  onClick={() => navigate('/forum/ask')}
                  className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-bold font-mono hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                >
                  Ask Question
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions List Section */}
      <div className="w-full bg-gradient-to-br from-white via-pink-50 to-purple-50 py-16 relative">
        {/* Decorative DSA elements */}
        <StackDecoration position="top-10 left-10" />
        {/* <QueueDecoration position="top-20 right-20" /> */}
        {/* <ArrayDecoration position="bottom-10 left-20" />
        <TreeDecoration position="bottom-20 right-10" /> */}
         <TreeDecoration position="bottom-20 right-10" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
            {filteredQuestions.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gradient-to-br from-green-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-3xl">💭</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-4 font-mono">
                  {searchTerm ? 'No questions found' : 'No questions yet'}
                </h3>
                <p className="text-gray-600 mb-6 max-w-md mx-auto font-mono">
                  {searchTerm 
                    ? 'Try adjusting your search terms or browse all questions.'
                    : 'Be the first to ask a question and start the conversation!'
                  }
                </p>
                {!searchTerm && (
                  <button
                    onClick={() => navigate('/forum/ask')}
                    className="px-8 py-3 bg-gradient-to-r from-green-500 to-blue-600 text-white rounded-xl font-bold font-mono hover:from-green-600 hover:to-blue-700 transform hover:scale-105 transition-all duration-200 shadow-lg"
                  >
                    Ask the First Question
                  </button>
                )}
              </div>
            ) : (
              <div className="divide-y divide-gray-200">
                {filteredQuestions.map((question, index) => (
                  <Link
                    key={question._id}
                    to={`/forum/questions/${question._id}`}
                    className="block p-6 hover:bg-gray-50 transition-colors duration-200"
                  >
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                          <span className="text-white text-sm font-bold">
                            {question.author?.username?.charAt(0).toUpperCase() || 'Q'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="text-xl font-bold text-gray-800 hover:text-green-600 transition-colors line-clamp-2 font-mono">
                            {question.title}
                          </h3>
                          <div className="flex items-center space-x-2 ml-4">
                            <div className="flex items-center space-x-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
                              <span>💬</span>
                              <span>{question.answers?.length || 0}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-gray-600 mb-3 line-clamp-2 font-mono">
                          {question.body.length > 150 
                            ? `${question.body.substring(0, 150)}...` 
                            : question.body
                          }
                        </p>
                        <div className="flex items-center justify-between text-sm text-gray-500">
                          <div className="flex items-center space-x-4">
                            <span className="font-medium text-gray-700 font-mono">
                              {question.author?.username || 'Anonymous'}
                            </span>
                            <span>•</span>
                            <span>{formatDate(question.createdAt)}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="px-2 py-1 bg-gray-100 rounded text-xs font-mono">
                              {question.answers?.length || 0} answer{(question.answers?.length || 0) !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForumHome; 