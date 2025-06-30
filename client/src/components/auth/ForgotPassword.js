import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import useApi from '../../hooks/useApi';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Decorative data structure components - Static versions
const ArrayDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="flex space-x-2">
      <div className="w-10 h-10 bg-blue-700 text-white text-sm rounded flex items-center justify-center shadow-md">5</div>
      <div className="w-10 h-10 bg-green-700 text-white text-sm rounded flex items-center justify-center shadow-md">2</div>
      <div className="w-10 h-10 bg-purple-700 text-white text-sm rounded flex items-center justify-center shadow-md">8</div>
    </div>
  </div>
);

const TreeDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="text-center">
      <div className="w-6 h-6 bg-green-800 rounded-full mx-auto mb-2 shadow-md"></div>
      <div className="flex justify-center space-x-3">
        <div className="w-5 h-5 bg-green-700 rounded-full shadow-md"></div>
        <div className="w-5 h-5 bg-green-700 rounded-full shadow-md"></div>
      </div>
    </div>
  </div>
);

const LinkedListDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-orange-700 rounded-full shadow-md"></div>
      <div className="w-3 h-1 bg-gray-600"></div>
      <div className="w-6 h-6 bg-orange-700 rounded-full shadow-md"></div>
      <div className="w-3 h-1 bg-gray-600"></div>
      <div className="w-6 h-6 bg-orange-700 rounded-full shadow-md"></div>
    </div>
  </div>
);

const StackDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="flex flex-col space-y-2">
      <div className="w-12 h-4 bg-red-700 rounded shadow-md"></div>
      <div className="w-12 h-4 bg-red-600 rounded shadow-md"></div>
      <div className="w-12 h-4 bg-red-500 rounded shadow-md"></div>
    </div>
  </div>
);

const QueueDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="flex space-x-2">
      <div className="w-4 h-8 bg-blue-600 rounded shadow-md"></div>
      <div className="w-4 h-8 bg-blue-700 rounded shadow-md"></div>
      <div className="w-4 h-8 bg-blue-800 rounded shadow-md"></div>
    </div>
  </div>
);

const BinarySearchDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-2">
      <div className="w-5 h-5 bg-yellow-600 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-yellow-500 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-yellow-400 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-yellow-300 rounded-full shadow-md"></div>
    </div>
  </div>
);

const GraphDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="grid grid-cols-2 gap-2">
      <div className="w-5 h-5 bg-purple-600 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-purple-500 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-purple-400 rounded-full shadow-md"></div>
      <div className="w-5 h-5 bg-purple-300 rounded-full shadow-md"></div>
    </div>
  </div>
);

const RecursionDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="flex items-center space-x-2">
      <div className="w-6 h-6 bg-pink-600 rounded-full shadow-md"></div>
      <div className="w-3 h-1 bg-gray-600"></div>
      <div className="w-5 h-5 bg-pink-500 rounded-full shadow-md"></div>
      <div className="w-3 h-1 bg-gray-600"></div>
      <div className="w-4 h-4 bg-pink-400 rounded-full shadow-md"></div>
    </div>
  </div>
);

const SortingDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="flex items-end space-x-2 h-8">
      <div className="w-3 bg-indigo-600 rounded-t shadow-md" style={{height: '60%'}}></div>
      <div className="w-3 bg-indigo-500 rounded-t shadow-md" style={{height: '80%'}}></div>
      <div className="w-3 bg-indigo-400 rounded-t shadow-md" style={{height: '40%'}}></div>
      <div className="w-3 bg-indigo-300 rounded-t shadow-md" style={{height: '100%'}}></div>
    </div>
  </div>
);

const DynamicProgrammingDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="grid grid-cols-2 gap-2">
      <div className="w-5 h-5 bg-teal-600 rounded shadow-md"></div>
      <div className="w-5 h-5 bg-teal-500 rounded shadow-md"></div>
      <div className="w-5 h-5 bg-teal-400 rounded shadow-md"></div>
      <div className="w-5 h-5 bg-teal-300 rounded shadow-md"></div>
    </div>
  </div>
);

const HashTableDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="grid grid-cols-3 gap-1">
      <div className="w-4 h-4 bg-emerald-600 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-500 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-400 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-300 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-200 rounded shadow-md"></div>
      <div className="w-4 h-4 bg-emerald-100 rounded shadow-md"></div>
    </div>
  </div>
);

const HeapDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="text-center">
      <div className="w-6 h-6 bg-amber-600 rounded-full mx-auto mb-1 shadow-md"></div>
      <div className="flex justify-center space-x-4">
        <div className="w-5 h-5 bg-amber-500 rounded-full shadow-md"></div>
        <div className="w-5 h-5 bg-amber-500 rounded-full shadow-md"></div>
      </div>
      <div className="flex justify-center space-x-8 mt-1">
        <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md"></div>
        <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md"></div>
        <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md"></div>
        <div className="w-4 h-4 bg-amber-400 rounded-full shadow-md"></div>
      </div>
    </div>
  </div>
);

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [step, setStep] = useState(1); // 1: email, 2: OTP, 3: new password
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { post } = useApi();

  const validateEmail = (email) => {
    const emailRegex = /\S+@\S+\.\S+/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    return password.length >= 6;
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!email) {
      setError('Email is required');
      return;
    }

    if (!validateEmail(email)) {
      setError('Please enter a valid email address');
      return;
    }

    try {
      setIsLoading(true);
      const response = await post(`${BACKEND_URL}/api/auth/forgot-password`, { email });
      
      if (response.message) {
        setMessage('OTP has been sent to your email address. Please check your inbox.');
      setStep(2);
      } else {
        setError('Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.response?.data?.message || 'Failed to send OTP. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!otp) {
      setError('OTP is required');
      return;
    }

    try {
      setIsLoading(true);
      const response = await post(`${BACKEND_URL}/api/auth/verify-otp`, { email, otp });
      
      if (response.message === 'OTP verified.') {
        setMessage('OTP verified successfully. Please enter your new password.');
      setStep(3);
      } else {
        setError('Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification error:', err);
      setError(err.response?.data?.message || 'Invalid OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    if (!newPassword) {
      setError('New password is required');
      return;
    }

    if (!validatePassword(newPassword)) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      setIsLoading(true);
      const response = await post(`${BACKEND_URL}/api/auth/reset-password`, { 
        email, 
        otp, 
        newPassword 
      });
      
      if (response.message === 'Password reset successful.') {
        setMessage('Password reset successfully! You can now login with your new password.');
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setStep(1);
      } else {
        setError('Failed to reset password. Please try again.');
      }
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <form className="space-y-6" onSubmit={handleSendOTP}>
          <div>
        <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-mono">
          Email Address
        </label>
            <input
          id="email"
              type="email"
              value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email address"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-black font-mono"
              required
            />
          </div>

          <button
            type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{
          background: 'linear-gradient(45deg, #16a34a 0%, #22c55e 25%, #3b82f6 50%, #1d4ed8 75%, #1e40af 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradientShift 3s ease infinite',
        }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Sending OTP...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>📧</span>
            <span>SEND OTP</span>
            <span>⚡</span>
          </div>
        )}
          </button>
        </form>
  );

  const renderStep2 = () => (
    <form className="space-y-6" onSubmit={handleVerifyOTP}>
          <div>
        <label htmlFor="otp" className="block text-sm font-semibold text-gray-700 mb-2 font-mono">
          Enter OTP
        </label>
            <input
          id="otp"
              type="text"
              value={otp}
          onChange={(e) => setOtp(e.target.value)}
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-black font-mono text-center text-2xl tracking-widest"
              required
            />
        <p className="text-sm text-gray-600 font-mono mt-2">
          We've sent a 6-digit OTP to {email}
        </p>
          </div>

          <button
            type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{
          background: 'linear-gradient(45deg, #16a34a 0%, #22c55e 25%, #3b82f6 50%, #1d4ed8 75%, #1e40af 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradientShift 3s ease infinite',
        }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Verifying OTP...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>🔐</span>
            <span>VERIFY OTP</span>
            <span>✅</span>
          </div>
        )}
          </button>

          <button
            type="button"
        onClick={() => setStep(1)}
        className="w-full py-2 text-gray-600 hover:text-gray-800 font-mono text-sm transition-colors"
          >
        ← Back to Email
          </button>
        </form>
  );

  const renderStep3 = () => (
    <form className="space-y-6" onSubmit={handleResetPassword}>
          <div>
        <label htmlFor="newPassword" className="block text-sm font-semibold text-gray-700 mb-2 font-mono">
          New Password
        </label>
              <input
          id="newPassword"
          type="password"
                value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Enter new password"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-black font-mono"
          required
        />
      </div>

      <div>
        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 font-mono">
          Confirm New Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-300 bg-white/90 backdrop-blur-sm text-gray-800 placeholder-black font-mono"
                required
              />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-300 transform hover:scale-105 font-mono tracking-wider disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
        style={{
          background: 'linear-gradient(45deg, #16a34a 0%, #22c55e 25%, #3b82f6 50%, #1d4ed8 75%, #1e40af 100%)',
          backgroundSize: '300% 300%',
          animation: 'gradientShift 3s ease infinite',
        }}
      >
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            <span>Resetting Password...</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <span>🔒</span>
            <span>RESET PASSWORD</span>
            <span>⚡</span>
          </div>
        )}
      </button>

              <button
                type="button"
        onClick={() => setStep(2)}
        className="w-full py-2 text-gray-600 hover:text-gray-800 font-mono text-sm transition-colors"
      >
        ← Back to OTP
      </button>
    </form>
  );

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-200 via-blue-100 to-purple-200 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden font-mono">
      {/* DSA Decorations - Scattered and Dynamic */}
      <ArrayDecoration position="top-16 left-8" rotation={15} scale={1.2} />
      <TreeDecoration position="top-24 right-60" rotation={-10} scale={2.2} />
      <StackDecoration position="bottom-16 right-28" rotation={-5} scale={1.4} />
      <QueueDecoration position="top-1/3 left-40" rotation={45} scale={1.4} />
      <BinarySearchDecoration position="top-1/3 right-10" rotation={-20} scale={1.3} />
      <GraphDecoration position="bottom-1/3 left-40" rotation={30} scale={1.8} />
      <RecursionDecoration position="top-0 right-140" rotation={-15} scale={1.6} />
      <RecursionDecoration position="bottom-1/3 right-12" rotation={-15} scale={1.6} />
      <SortingDecoration position="top-2/3 left-4" rotation={60} scale={1.4} />
      <ArrayDecoration position="bottom-8 left-1/4" rotation={75} scale={1.6} />
      <TreeDecoration position="bottom-8 right-1/4" rotation={-45} scale={1.8} />
      
      {/* CSS Animation for gradient shift */}
      <style jsx>{`
        @keyframes gradientShift {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div className="max-w-md w-full space-y-8 relative z-10">
        {/* Main Form Container with 80% opacity background */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">🔐</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 font-mono tracking-wider">
              RESET PASSWORD
            </h2>
            <p className="text-gray-600 font-mono">
              {step === 1 && 'Enter your email to receive an OTP'}
              {step === 2 && 'Enter the OTP sent to your email'}
              {step === 3 && 'Enter your new password'}
            </p>
          </div>

          {error && (
            <div className="bg-red-100/90 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
              <span className="block sm:inline font-mono">{error}</span>
            </div>
          )}

          {message && (
            <div className="bg-green-100/90 border border-green-400 text-green-700 px-4 py-3 rounded-xl relative mb-6" role="alert">
              <span className="block sm:inline font-mono">{message}</span>
            </div>
          )}

          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}

          <div className="text-center space-y-4 mt-6">
            <div className="text-sm text-gray-600 font-mono">
              Remember your password?{' '}
              <Link 
                to="/login" 
                className="font-semibold text-green-600 hover:text-green-700 transition-colors duration-300"
              >
                Back to Login
              </Link>
            </div>
            
            <div className="text-sm text-gray-600 font-mono">
              Don't have an account?{' '}
              <Link 
                to="/register" 
                className="font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-300"
              >
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword; 