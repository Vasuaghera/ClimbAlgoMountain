import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

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

const getUserId = () => {
  try {
    const token = localStorage.getItem('token');
    if (!token) return null;
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId || payload.id || payload._id;
  } catch {
    return null;
  }
};

const QuestionDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answer, setAnswer] = useState('');
  const [posting, setPosting] = useState(false);
  const [postError, setPostError] = useState(null);
  const [upvoteLoading, setUpvoteLoading] = useState(null);
  const [upvoteMsg, setUpvoteMsg] = useState(null);
  const [charCount, setCharCount] = useState(0);
  const userId = getUserId();

  const fetchQuestion = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/forum/questions/${id}`);
      const data = await res.json();
      setQuestion(data.question);
    } catch (err) {
      setError('Failed to load question');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestion();
    // eslint-disable-next-line
  }, [id]);

  const handlePostAnswer = async (e) => {
    e.preventDefault();
    setPosting(true);
    setPostError(null);
    try {
      const res = await fetch(`${BACKEND_URL}/forum/questions/${id}/answers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ body: answer }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || 'Failed to post answer');
      }
      setAnswer('');
      setCharCount(0);
      fetchQuestion();
    } catch (err) {
      setPostError(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleUpvote = async (answerId) => {
    setUpvoteLoading(answerId);
    try {
      const res = await fetch(`${BACKEND_URL}/forum/answers/${answerId}/upvote`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await res.json();
      setUpvoteMsg(data.message || 'Upvote updated');
      setTimeout(() => setUpvoteMsg(null), 2000);
      fetchQuestion();
    } catch {}
    setUpvoteLoading(null);
  };

  const handleAnswerChange = (e) => {
    const value = e.target.value;
    setAnswer(value);
    setCharCount(value.length);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    if (diffInHours < 48) return 'Yesterday';
    return date.toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg">Loading question...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Error Loading Question</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate('/forum')}
            className="px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Back to Q&A
          </button>
        </div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center font-mono">
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">❓</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Question Not Found</h2>
          <p className="text-gray-600 mb-6">The question you're looking for doesn't exist.</p>
          <button
            onClick={() => navigate('/forum')}
            className="px-8 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white rounded-2xl hover:from-green-600 hover:via-emerald-600 hover:to-teal-600 transition-all duration-300 shadow-lg hover:shadow-xl"
          >
            Back to Q&A
          </button>
        </div>
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
      <div className="w-full bg-gradient-to-b from-green-200 via-green-100 via-green-50 to-white py-12 relative">
        {/* Decorative DSA elements */}
        {/* <ArrayDecoration position="top-10 left-10" /> */}
        {/* <TreeDecoration position="top-20 right-20" /> */}
        <LinkedListDecoration position="bottom-10 left-20" />
        <StackDecoration position="bottom-20 right-10" />
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <button
              onClick={() => navigate('/forum')}
              className="flex items-center text-gray-600 hover:text-green-600 mb-6 transition-all duration-300 hover:bg-gray-100 px-4 py-2 rounded-2xl"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Q&A
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full flex-1 bg-white relative">
        {/* Decorative DSA elements */}
        {/* <QueueDecoration position="top-10 left-10" /> */}
        <ArrayDecoration position="top-20 right-20" />
        <TreeDecoration position="bottom-10 left-20" />
        {/* <LinkedListDecoration position="bottom-20 right-10" /> */}
        
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Question Card */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 p-6">
              <h2 className="text-2xl font-bold text-white font-mono">Question Details</h2>
              <p className="text-green-100 mt-1">Community discussion and answers</p>
            </div>
            
            <div className="p-8">
              <div className="flex items-start justify-between mb-6">
                <div className="flex-1">
                  <h1 className="text-4xl font-bold text-gray-800 mb-6 font-mono leading-tight">
                    {question.title}
                  </h1>
                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                        <span className="text-white text-sm font-bold">
                          {question.author?.username?.charAt(0).toUpperCase() || 'U'}
                        </span>
                      </div>
                      <span className="font-semibold text-gray-700">
                        {question.author?.username || 'Unknown'}
                      </span>
                    </div>
                    <span className="text-gray-400">•</span>
                    <span>{formatDate(question.createdAt)}</span>
                    <span className="text-gray-400">•</span>
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      {question.answers?.length || 0} answer{(question.answers?.length || 0) !== 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              </div>

              <div className="prose prose-lg max-w-none">
                <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-2xl p-6 border border-gray-100">
                  {question.body}
                </div>
              </div>
            </div>
          </div>

          {/* Answers Section */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden mb-8">
            <div className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 p-6">
              <h2 className="text-2xl font-bold text-white font-mono">
                Answers ({question.answers?.length || 0})
              </h2>
              {question.answers?.length === 0 && (
                <p className="text-blue-100 mt-1">Be the first to answer!</p>
              )}
            </div>
            
            <div className="p-8">
              {question.answers && question.answers.length > 0 ? (
                <div className="space-y-6">
                  {question.answers.map((ans, index) => {
                    const hasUpvoted = ans.upvotes && userId && ans.upvotes.some(uid => uid === userId || uid?._id === userId);
                    return (
                      <div key={ans._id} className="border-2 border-gray-100 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:border-green-200">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 rounded-full flex items-center justify-center shadow-lg">
                              <span className="text-white text-sm font-bold">
                                {ans.author?.username?.charAt(0).toUpperCase() || 'A'}
                              </span>
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-4">
                              <div className="flex items-center space-x-3">
                                <span className="font-bold text-gray-800">
                                  {ans.author?.username || 'Anonymous'}
                                </span>
                                <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                                  {formatDate(ans.createdAt)}
                                </span>
                              </div>
                              <button
                                className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-300 ${
                                  hasUpvoted 
                                    ? 'bg-green-100 text-green-700 border-2 border-green-200 shadow-md' 
                                    : 'bg-gray-100 text-gray-700 hover:bg-green-50 hover:text-green-700 border-2 border-gray-200 hover:border-green-200'
                                }`}
                                onClick={() => handleUpvote(ans._id)}
                                disabled={!userId || upvoteLoading === ans._id}
                                title={userId ? (hasUpvoted ? 'Remove upvote' : 'Upvote') : 'Login to upvote'}
                              >
                                {upvoteLoading === ans._id ? (
                                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                                ) : (
                                  <span className="text-lg">▲</span>
                                )}
                                <span>{ans.upvotes ? ans.upvotes.length : 0}</span>
                              </button>
                            </div>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line bg-gray-50 rounded-xl p-4 border border-gray-100">
                              {ans.body}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <span className="text-4xl">💭</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-4">No answers yet</h3>
                  <p className="text-gray-600 text-lg">Be the first to share your knowledge!</p>
                </div>
              )}
            </div>
          </div>

          {/* Answer Form */}
          <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 p-6">
              <h3 className="text-2xl font-bold text-white font-mono">
                Your Answer
              </h3>
              <p className="text-orange-100 mt-1">Share your knowledge and help others learn</p>
            </div>
            
            <div className="p-8">
              <form onSubmit={handlePostAnswer}>
                <div className="relative mb-6">
                  <textarea
                    className="w-full px-6 py-4 bg-gray-50 border-2 border-gray-200 rounded-2xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-4 focus:ring-orange-200 focus:border-orange-500 transition-all duration-300 resize-none shadow-sm"
                    value={answer}
                    onChange={handleAnswerChange}
                    required
                    rows={8}
                    maxLength={2000}
                    placeholder="Share your knowledge and help others learn. Be clear, concise, and include examples if relevant."
                  />
                  <div className="absolute bottom-4 right-4">
                    <span className={`text-sm font-mono ${
                      charCount > 1800 ? 'text-red-500' : 'text-gray-400'
                    }`}>
                      {charCount}/2000
                    </span>
                  </div>
                </div>
                
                {postError && (
                  <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 rounded-2xl">
                    <div className="flex items-center">
                      <svg className="w-5 h-5 text-red-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                      <span className="text-red-700 font-medium">{postError}</span>
                    </div>
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                    Help others learn by sharing your knowledge
                  </div>
                  <button
                    type="submit"
                    className={`px-10 py-4 rounded-2xl font-bold font-mono transition-all duration-300 transform hover:scale-105 shadow-lg ${
                      posting || !answer.trim()
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 text-white hover:from-orange-600 hover:via-red-600 hover:to-pink-600 hover:shadow-xl'
                    }`}
                    disabled={posting || !answer.trim()}
                  >
                    {posting ? (
                      <div className="flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent mr-3"></div>
                        Posting Answer...
                      </div>
                    ) : (
                      'Post Answer'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Success Message */}
      {upvoteMsg && (
        <div className="fixed bottom-6 right-6 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white px-8 py-4 rounded-2xl shadow-2xl z-50 animate-bounce">
          <div className="flex items-center">
            <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-semibold">{upvoteMsg}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail; 