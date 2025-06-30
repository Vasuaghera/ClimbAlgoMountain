import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

const EyeIcon = ({ visible }) => (
  visible ? (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
  ) : (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a9.956 9.956 0 012.293-3.95m3.36-2.252A9.956 9.956 0 0112 5c4.478 0 8.268 2.943 9.542 7a9.956 9.956 0 01-4.043 5.306M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3l18 18" /></svg>
  )
);

// Decorative data structure components - Static versions
const ArrayDecoration = ({ position, rotation = 0, scale = 1 }) => (
  <div 
    className={`absolute ${position} opacity-80 pointer-events-none`}
    style={{ 
      transform: `rotate(${rotation}deg) scale(${scale})`,
      transition: 'none'
    }}
  >
    <div className="flex space-x-1">
      <div className="w-6 h-6 bg-blue-700 text-white text-xs rounded flex items-center justify-center shadow-md">5</div>
      <div className="w-6 h-6 bg-green-700 text-white text-xs rounded flex items-center justify-center shadow-md">2</div>
      <div className="w-6 h-6 bg-purple-700 text-white text-xs rounded flex items-center justify-center shadow-md">8</div>
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
      <div className="w-4 h-4 bg-green-800 rounded-full mx-auto mb-1 shadow-md"></div>
      <div className="flex justify-center space-x-2">
        <div className="w-3 h-3 bg-green-700 rounded-full shadow-md"></div>
        <div className="w-3 h-3 bg-green-700 rounded-full shadow-md"></div>
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
    <div className="flex items-center space-x-1">
      <div className="w-4 h-4 bg-orange-700 rounded-full shadow-md"></div>
      <div className="w-2 h-0.5 bg-gray-600"></div>
      <div className="w-4 h-4 bg-orange-700 rounded-full shadow-md"></div>
      <div className="w-2 h-0.5 bg-gray-600"></div>
      <div className="w-4 h-4 bg-orange-700 rounded-full shadow-md"></div>
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
    <div className="flex flex-col space-y-1">
      <div className="w-8 h-3 bg-red-700 rounded shadow-md"></div>
      <div className="w-8 h-3 bg-red-600 rounded shadow-md"></div>
      <div className="w-8 h-3 bg-red-500 rounded shadow-md"></div>
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
    <div className="flex space-x-1">
      <div className="w-3 h-6 bg-blue-600 rounded shadow-md"></div>
      <div className="w-3 h-6 bg-blue-700 rounded shadow-md"></div>
      <div className="w-3 h-6 bg-blue-800 rounded shadow-md"></div>
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
    <div className="flex items-center space-x-1">
      <div className="w-3 h-3 bg-yellow-600 rounded-full shadow-md"></div>
      <div className="w-3 h-3 bg-yellow-500 rounded-full shadow-md"></div>
      <div className="w-3 h-3 bg-yellow-400 rounded-full shadow-md"></div>
      <div className="w-3 h-3 bg-yellow-300 rounded-full shadow-md"></div>
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
    <div className="grid grid-cols-2 gap-1">
      <div className="w-3 h-3 bg-purple-600 rounded-full shadow-md"></div>
      <div className="w-3 h-3 bg-purple-500 rounded-full shadow-md"></div>
      <div className="w-3 h-3 bg-purple-400 rounded-full shadow-md"></div>
      <div className="w-3 h-3 bg-purple-300 rounded-full shadow-md"></div>
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
    <div className="flex items-center space-x-1">
      <div className="w-4 h-4 bg-pink-600 rounded-full shadow-md"></div>
      <div className="w-2 h-0.5 bg-gray-600"></div>
      <div className="w-3 h-3 bg-pink-500 rounded-full shadow-md"></div>
      <div className="w-2 h-0.5 bg-gray-600"></div>
      <div className="w-2 h-2 bg-pink-400 rounded-full shadow-md"></div>
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
    <div className="flex items-end space-x-1 h-6">
      <div className="w-2 bg-indigo-600 rounded-t shadow-md" style={{height: '60%'}}></div>
      <div className="w-2 bg-indigo-500 rounded-t shadow-md" style={{height: '80%'}}></div>
      <div className="w-2 bg-indigo-400 rounded-t shadow-md" style={{height: '40%'}}></div>
      <div className="w-2 bg-indigo-300 rounded-t shadow-md" style={{height: '100%'}}></div>
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
    <div className="grid grid-cols-2 gap-1">
      <div className="w-3 h-3 bg-teal-600 rounded shadow-md"></div>
      <div className="w-3 h-3 bg-teal-500 rounded shadow-md"></div>
      <div className="w-3 h-3 bg-teal-400 rounded shadow-md"></div>
      <div className="w-3 h-3 bg-teal-300 rounded shadow-md"></div>
    </div>
  </div>
);

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const { register, error } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.username) {
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      setIsLoading(true);
      const { confirmPassword, ...registerData } = formData;
      await register(registerData);
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };

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
            <div className="text-6xl mb-4">🚀</div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2 font-mono tracking-wider">
              JOIN THE JOURNEY
            </h2>
            <p className="text-gray-600 font-mono">
              Start your DSA adventure today
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-semibold text-gray-700 mb-2 font-mono">
                  Username
                </label>
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-mono placeholder-black ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Choose a username"
                  value={formData.username}
                  onChange={handleChange}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600 font-mono">{errors.username}</p>
                )}
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2 font-mono">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-mono placeholder-black ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600 font-mono">{errors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2 font-mono">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    id="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                    className={`w-full text-black px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-mono pr-12 placeholder-black ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    }`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    tabIndex={-1}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    <EyeIcon visible={showPassword} />
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600 font-mono">{errors.password}</p>
                )}
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2 font-mono">
                  Confirm Password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                  className={`w-full  px-4 py-3 text-black border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white/70 backdrop-blur-sm font-mono placeholder-black ${
                    errors.confirmPassword ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600 font-mono">{errors.confirmPassword}</p>
                )}
              </div>
            </div>

            {error && (
              <div className="bg-red-100/90 border border-red-400 text-red-700 px-4 py-3 rounded-xl relative" role="alert">
                <span className="block sm:inline font-mono">{error}</span>
              </div>
            )}

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-lg font-bold rounded-xl text-white bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 hover:from-green-700 hover:via-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 transition-all duration-300 transform hover:scale-105 shadow-lg font-mono tracking-wider"
                style={{
                  background: 'linear-gradient(45deg, #16a34a 0%, #22c55e 25%, #3b82f6 50%, #1d4ed8 75%, #1e40af 100%)',
                  backgroundSize: '300% 300%',
                  animation: 'gradientShift 3s ease infinite',
                }}
              >
                {isLoading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'}
              </button>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-gray-600 text-sm font-mono">
              Already have an account?{' '}
              <Link to="/login" className="text-green-600 hover:text-green-700 hover:underline font-semibold transition-colors">
                Sign in here
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm; 