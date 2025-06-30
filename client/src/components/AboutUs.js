import React from 'react';

const AboutUs = () => {
  // DSA Decorative Components
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
        {/* <ArrayDecoration position="top-10 left-10" /> */}
        <TreeDecoration position="top-20 right-20" />
        <LinkedListDecoration position="bottom-10 left-20" />
        {/* <StackDecoration position="bottom-20 right-10" /> */}
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-500 to-blue-600 rounded-2xl mb-6 shadow-xl">
            <span className="text-4xl">🎮</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4 font-mono tracking-wider text-green-600">
            ABOUT DSA GAME
          </h1>
          <p className="text-xl text-gray-700 max-w-3xl mx-auto font-mono">
            Where <span className="text-green-600 font-bold">Data Structures & Algorithms</span> meet{' '}
            <span className="text-green-600 font-bold">Fun & Learning</span>
          </p>
          
          {/* Mission Statement */}
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 max-w-4xl mx-auto mt-8">
            <p className="text-lg text-gray-700 font-mono leading-relaxed">
              We believe learning DSA should be <span className="text-green-600 font-semibold">exciting</span>, not intimidating. 
              Our platform transforms complex algorithms into interactive games, making every concept 
              <span className="text-green-600 font-semibold"> visual, engaging, and memorable</span>.
            </p>
          </div>
        </div>
      </div>

      {/* Features Grid Section */}
      <div className="w-full bg-gradient-to-br from-white via-blue-50 to-purple-50 py-16 relative">
        {/* Decorative DSA elements */}
        <QueueDecoration position="top-10 left-10" />
        <ArrayDecoration position="top-20 right-20" />
        {/* <TreeDecoration position="bottom-10 left-20" />
        <LinkedListDecoration position="bottom-20 right-10" /> */}
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              WHY CHOOSE DSA GAME?
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              Experience the perfect blend of education and entertainment
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Feature Cards */}
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-blue-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl">🎮</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Interactive Gaming</h3>
              <p className="text-gray-600 text-sm font-mono">
                Learn through hands-on games that make complex algorithms feel like fun challenges
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-green-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl">📊</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Progress Tracking</h3>
              <p className="text-gray-600 text-sm font-mono">
                Monitor your learning journey with detailed analytics and achievement milestones
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-purple-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Competitive Spirit</h3>
              <p className="text-gray-600 text-sm font-mono">
                Compete on leaderboards, earn badges, and challenge yourself with daily streaks
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-orange-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl">👥</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Community Driven</h3>
              <p className="text-gray-600 text-sm font-mono">
                Connect with fellow learners, share solutions, and get help from our AI assistant
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-pink-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Visual Learning</h3>
              <p className="text-gray-600 text-sm font-mono">
                See algorithms in action with beautiful visualizations and step-by-step animations
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-lg border border-indigo-200 hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg">
                <span className="text-2xl">🚀</span>
              </div>
              <h3 className="text-lg font-bold text-gray-800 mb-2 font-mono">Modern Platform</h3>
              <p className="text-gray-600 text-sm font-mono">
                Built with cutting-edge technology for the best learning experience across all devices
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Creator Section */}
      <div className="w-full bg-gradient-to-br from-white via-pink-50 to-purple-50 py-16 relative">
        {/* Decorative DSA elements */}
        <StackDecoration position="top-10 left-10" />
        {/* <QueueDecoration position="top-20 right-20" /> */}
        {/* <ArrayDecoration position="bottom-10 left-20" /> */}
        <TreeDecoration position="bottom-20 right-10" />
        
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 font-mono tracking-wider text-green-600">
              MEET THE CREATOR
            </h2>
            <p className="text-gray-700 text-lg font-mono">
              The mind behind DSA Game
            </p>
          </div>
          
          <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
              {/* Creator Info */}
              <div>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-full flex items-center justify-center mr-4 shadow-lg">
                    <span className="text-2xl text-white font-bold">V</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 font-mono">Vasu Aghera</h3>
                    <p className="text-green-600 font-mono">Full Stack Developer & DSA Enthusiast</p>
                  </div>
                </div>
                <p className="text-lg text-gray-700 font-mono leading-relaxed mb-6">
                  This project was born from a passion for making complex programming concepts accessible to everyone. 
                  I believe that learning should be engaging, interactive, and most importantly, fun!
                </p>
                <p className="text-lg text-gray-700 font-mono leading-relaxed">
                  Whether you're a beginner or an experienced developer, DSA Game is designed to help you master 
                  Data Structures & Algorithms in the most enjoyable way possible.
                </p>
              </div>

              {/* Contact Card */}
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border border-green-200">
                <h3 className="text-xl font-bold text-gray-800 mb-4 font-mono">Get in Touch</h3>
                <p className="text-gray-600 font-mono mb-6">
                  Have feedback, suggestions, or want to contribute? I'd love to hear from you!
                </p>
                
                <a 
                  href="mailto:vasuaghera33@gmail.com"
                  className="inline-flex items-center w-full bg-gradient-to-r from-green-500 to-blue-600 hover:from-green-600 hover:to-blue-700 text-white font-bold py-3 px-6 rounded-xl text-center transition-all duration-200 font-mono shadow-lg"
                >
                  <span className="mr-2">📧</span>
                  Send Email
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs; 