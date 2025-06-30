import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLoading } from '../hooks/useLoading';
import { DataLoading } from './Loading';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const Chatbot = () => {
  const { user } = useAuth();
  const { isLoading, withLoading } = useLoading();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: `Hi ${user?.username || 'there'}! 👋 I'm your DSA tutor. Ask me anything about Data Structures and Algorithms!`,
      timestamp: new Date()
    }
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // DSA Decorative Components
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = input.trim();
    setInput('');
    
    // Add user message and scroll immediately
    setMessages(prev => [...prev, { from: 'user', text: userMessage, timestamp: new Date() }]);
    
    setLoading(true);
    setError(null);
    setIsTyping(true);

    try {
      await withLoading(async () => {
      const res = await fetch(`${BACKEND_URL}/api/chatbot/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: userMessage })
      });

      if (!res.ok) {
        throw new Error('Failed to get response');
      }

      const data = await res.json();
      
      // Simulate typing delay for better UX
      setTimeout(() => {
        setIsTyping(false);
        setMessages(prev => [...prev, { 
          from: 'bot', 
          text: data.answer || 'Sorry, I could not generate an answer. Please try again.', 
          timestamp: new Date() 
        }]);
        setLoading(false);
      }, 1000);
      }, 'Getting AI Response...');
    } catch (err) {
      setIsTyping(false);
      setLoading(false);
      setError('Failed to get answer from chatbot. Please check your connection and try again.');
      setMessages(prev => [...prev, { 
        from: 'bot', 
        text: 'Sorry, I encountered an error. Please try again later.', 
        timestamp: new Date() 
      }]);
    }
  };

  const formatTime = (timestamp) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const quickQuestions = [
    "What is a Binary Search Tree?",
    "Explain Dynamic Programming",
    "How does Quick Sort work?",
    "What are the differences between Stack and Queue?",
    "Explain Graph traversal algorithms",
    "What is Time Complexity?",
    "Explain Recursion with examples"
  ];

  const handleQuickQuestion = (question) => {
    setInput(question);
  };

  // Function to format AI response with better styling
  const formatAIResponse = (text) => {
    // Remove markdown ** syntax and highlight important terms
    const cleanText = text.replace(/\*\*(.*?)\*\*/g, '$1');
    
    // Split text into paragraphs
    const paragraphs = cleanText.split('\n\n');
    
    // Important DSA terms to highlight
    const importantTerms = [
      'algorithm', 'data structure', 'time complexity', 'space complexity', 'O(n)', 'O(log n)', 'O(1)', 'O(n²)',
      'binary search', 'linear search', 'sorting', 'bubble sort', 'quick sort', 'merge sort', 'heap sort',
      'stack', 'queue', 'linked list', 'array', 'tree', 'graph', 'hash table', 'binary tree', 'BST',
      'recursion', 'iteration', 'dynamic programming', 'greedy', 'backtracking', 'divide and conquer',
      'pointer', 'node', 'edge', 'vertex', 'traversal', 'DFS', 'BFS', 'inorder', 'preorder', 'postorder',
      'heap', 'priority queue', 'min heap', 'max heap', 'balanced tree', 'AVL tree', 'red-black tree',
      'adjacency matrix', 'adjacency list', 'dijkstra', 'bellman-ford', 'floyd-warshall', 'kruskal', 'prim',
      'bubble sort', 'selection sort', 'insertion sort', 'shell sort', 'counting sort', 'radix sort',
      'binary search tree', 'trie', 'segment tree', 'fenwick tree', 'union find', 'disjoint set'
    ];
    
    // Function to highlight important terms in text
    const highlightTerms = (text) => {
      let highlightedText = text;
      importantTerms.forEach(term => {
        const regex = new RegExp(`\\b${term}\\b`, 'gi');
        highlightedText = highlightedText.replace(regex, `<span class="font-semibold text-green-700 bg-green-50 px-1 rounded">${term}</span>`);
      });
      return highlightedText;
    };
    
    return paragraphs.map((paragraph, index) => {
      // Check if it's a code block
      if (paragraph.includes('```')) {
        const codeMatch = paragraph.match(/```(\w+)?\n([\s\S]*?)```/);
        if (codeMatch) {
          const language = codeMatch[1] || 'text';
          const code = codeMatch[2];
          return (
            <div key={index} className="my-3">
              <div className="bg-gray-800 rounded-lg p-4 overflow-x-auto">
                <div className="text-xs text-gray-400 mb-2 font-mono">{language}</div>
                <pre className="text-green-400 font-mono text-sm whitespace-pre-wrap">{code}</pre>
              </div>
            </div>
          );
        }
      }
      
      // Check if it's a heading
      if (paragraph.startsWith('#')) {
        const level = paragraph.match(/^#+/)[0].length;
        const headingText = paragraph.replace(/^#+\s*/, '');
        const HeadingTag = `h${Math.min(level, 6)}`;
        return (
          <div key={index} className="my-3">
            <HeadingTag className={`font-bold text-green-600 font-mono ${
              level === 1 ? 'text-xl' : level === 2 ? 'text-lg' : 'text-base'
            }`}>
              {headingText}
            </HeadingTag>
          </div>
        );
      }
      
      // Check if it's a bullet list
      if (paragraph.includes('•') || paragraph.includes('- ')) {
        const items = paragraph.split(/\n/).filter(item => item.trim().startsWith('•') || item.trim().startsWith('- '));
        if (items.length > 0) {
          return (
            <div key={index} className="my-3">
              <ul className="list-disc list-inside space-y-1">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700 ml-2">
                    <span dangerouslySetInnerHTML={{ 
                      __html: highlightTerms(item.replace(/^[•-]\s*/, '')) 
                    }} />
                  </li>
                ))}
              </ul>
            </div>
          );
        }
      }
      
      // Check if it's a numbered list
      if (paragraph.match(/^\d+\./)) {
        const items = paragraph.split(/\n/).filter(item => item.trim().match(/^\d+\./));
        if (items.length > 0) {
          return (
            <div key={index} className="my-3">
              <ol className="list-decimal list-inside space-y-1">
                {items.map((item, itemIndex) => (
                  <li key={itemIndex} className="text-gray-700 ml-2">
                    <span dangerouslySetInnerHTML={{ 
                      __html: highlightTerms(item.replace(/^\d+\.\s*/, '')) 
                    }} />
                  </li>
                ))}
              </ol>
            </div>
          );
        }
      }
      
      // Check for inline code
      if (paragraph.includes('`')) {
        const parts = paragraph.split(/(`[^`]+`)/);
        return (
          <div key={index} className="my-2">
            {parts.map((part, partIndex) => {
              if (part.startsWith('`') && part.endsWith('`')) {
                return (
                  <code key={partIndex} className="bg-gray-200 px-2 py-1 rounded text-sm font-mono text-green-600">
                    {part.slice(1, -1)}
                  </code>
                );
              }
              return (
                <span key={partIndex} dangerouslySetInnerHTML={{ 
                  __html: highlightTerms(part) 
                }} />
              );
            })}
          </div>
        );
      }
      
      // Regular paragraph
      return (
        <div key={index} className="my-2 text-gray-700 leading-relaxed">
          <span dangerouslySetInnerHTML={{ 
            __html: highlightTerms(paragraph) 
          }} />
        </div>
      );
    });
  };

  return (
    <div className="h-screen bg-white flex flex-col font-mono relative overflow-hidden">
      {/* Loading Animation */}
      {isLoading && <DataLoading />}
      
      {/* CSS Animation for gradient shift */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      {/* Header */}
      <div className="bg-white border-b border-gray-200 flex-shrink-0 relative">
        {/* Decorative DSA elements */}
        <ArrayDecoration position="top-4 left-4" />
        <TreeDecoration position="top-4 right-4" />
        
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
              <span className="text-2xl">🤖</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800 font-mono">DSA Tutor</h1>
              <p className="text-gray-600 font-mono text-sm">Your AI-powered Data Structures & Algorithms assistant</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Chat Interface */}
        <div className="flex-1 flex flex-col">
          <div className="bg-white rounded-none border-r border-gray-200 flex flex-col h-full">
            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4 scroll-smooth">
              {messages.map((msg, idx) => (
                <div key={idx} className={`flex ${msg.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs lg:max-w-md xl:max-w-lg ${msg.from === 'user' ? 'order-2' : 'order-1'}`}>
                    <div className={`px-4 py-3 rounded-2xl ${
                      msg.from === 'user' 
                        ? 'bg-gradient-to-r from-green-500 to-blue-600 text-white' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {msg.from === 'user' ? (
                        <div className="whitespace-pre-wrap font-mono">{msg.text}</div>
                      ) : (
                        <div className="space-y-2">
                          {formatAIResponse(msg.text)}
                        </div>
                      )}
                      <div className={`text-xs mt-2 ${
                        msg.from === 'user' ? 'text-green-100' : 'text-gray-500'
                      }`}>
                        {formatTime(msg.timestamp)}
                      </div>
                    </div>
                  </div>
                  {msg.from === 'bot' && (
                    <div className="order-2 ml-3">
                      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                        <span className="text-sm">🤖</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="max-w-xs lg:max-w-md xl:max-w-lg">
                    <div className="bg-gray-100 px-4 py-3 rounded-2xl">
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-sm text-gray-500 font-mono">AI is typing...</span>
                      </div>
                    </div>
                  </div>
                  <div className="ml-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-sm">🤖</span>
                    </div>
                  </div>
                </div>
              )}
              
              <div ref={messagesEndRef} className="h-1" />
            </div>

            {/* Input Area */}
            <div className="border-t border-gray-200 p-4 flex-shrink-0">
              <form onSubmit={handleSend} className="flex space-x-3">
                <input
                  ref={inputRef}
                  type="text"
                  className="flex-1 px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-200 font-mono"
                  placeholder="Ask me anything about DSA..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  disabled={loading}
                />
                <button
                  type="submit"
                  className={`px-6 py-3 rounded-xl font-bold font-mono transition-all duration-200 ${
                    loading || !input.trim()
                      ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      : 'bg-gradient-to-r from-green-500 to-blue-600 text-white hover:from-green-600 hover:to-blue-700 transform hover:scale-105 shadow-lg'
                  }`}
                  disabled={loading || !input.trim()}
                >
                  {loading ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                      Sending
                    </div>
                  ) : (
                    'Send'
                  )}
                </button>
              </form>
              
              {error && (
                <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-xl">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-red-600 font-mono">{error}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-80 bg-white border-l border-gray-200 flex-shrink-0 overflow-y-auto">
          <div className="p-6">
            {/* Quick Questions */}
            <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 font-mono">Quick Questions</h3>
              <div className="space-y-3">
                {quickQuestions.map((question, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleQuickQuestion(question)}
                    className="w-full text-left p-3 bg-white hover:bg-green-50 rounded-lg transition-all duration-200 group border border-gray-200 hover:border-green-300"
                  >
                    <div className="text-sm text-gray-700 group-hover:text-green-600 font-mono">
                      {question}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot; 