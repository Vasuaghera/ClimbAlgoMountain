import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

// Small pixel dino SVG for branding
const DinoIcon = () => (
  <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="inline-block align-middle mr-2" shapeRendering="crispEdges">
    <rect x="18" y="4" width="8" height="5" className="fill-green-600" />
    <rect x="22" y="6" width="1" height="1" className="fill-white" />
    <rect x="18" y="10" width="8" height="1" className="fill-green-600" />
    <rect x="10" y="9" width="12" height="7" className="fill-green-600" />
    <rect x="8" y="11" width="12" height="7" className="fill-green-600" />
    <rect x="6" y="14" width="2" height="4" className="fill-green-600" />
    <rect x="2" y="17" width="4" height="2" className="fill-green-600" />
    <rect x="1" y="19" width="1" height="1" className="fill-green-600" />
    <rect x="16" y="16" width="2" height="1" className="fill-green-600" />
    <rect x="10" y="18" width="2" height="6" className="fill-green-600" />
    <rect x="14" y="18" width="2" height="6" className="fill-green-600" />
  </svg>
);

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Helper to get user initials
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase();
  };

  // Helper to get full user ID
  const getFullUserId = (user) => {
    if (!user) return '';
    return user._id || user.id || '';
  };

  const navLinks = [
    { to: '/', label: 'Home', auth: true },
    { to: '/games', label: 'Games', auth: true },
    { to: '/leaderboard', label: 'Leaderboard', auth: true },
    { to: '/rewards', label: 'Rewards', auth: true },
    { to: '/friends', label: 'Friends', auth: true },
    { to: '/forum', label: 'Q&A', auth: true },
    { to: '/chatbot', label: 'Chatbot', auth: true },
    { to: '/about', label: 'About', always: true },
  ];

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50 border-b-2 border-gray-200 font-mono">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Left-aligned Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-6 flex-nowrap overflow-x-auto">
            {navLinks.filter(l => l.always || user).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-800 hover:text-green-600 font-bold uppercase tracking-widest px-2 py-1 transition-colors duration-150 border-b-2 border-transparent hover:border-green-600 whitespace-nowrap"
                style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.13em' }}
              >
                {link.label}
              </Link>
            ))}
            {/* Custom Profile Link */}
            {user && (
              <Link
                to={`/profile/${getFullUserId(user)}`}
                className="text-gray-800 hover:text-green-600 font-bold uppercase tracking-widest px-2 py-1 transition-colors duration-150 border-b-2 border-transparent hover:border-green-600 whitespace-nowrap"
                style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.13em' }}
              >
                Profile
              </Link>
            )}
          </div>

          {/* Right-aligned User section (desktop) */}
          <div className="hidden md:flex md:items-center md:space-x-4">
            {user ? (
              <>
                <span className="text-gray-800 text-sm font-bold" style={{ fontFamily: 'monospace' }}>{user.username.length > 10 ? user.username.substring(0, 10) + "..." : user.username}</span>
                <button
                  onClick={handleLogout}
                  className="px-3 py-1.5 rounded bg-green-500 text-white hover:bg-green-600 font-bold text-sm transition-colors border border-gray-200"
                  style={{ fontFamily: 'monospace' }}
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-800 hover:text-green-600 px-3 py-1.5 rounded text-sm font-bold"
                  style={{ fontFamily: 'monospace' }}
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 text-sm font-bold"
                  style={{ fontFamily: 'monospace' }}
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>

          {/* Hamburger (mobile) */}
          <div className="md:hidden flex items-center absolute right-4 top-1/2 -translate-y-1/2">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-800 hover:text-green-600 focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {menuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="md:hidden bg-white shadow-lg border-t-2 border-gray-200 transition-colors duration-300">
          <div className="flex flex-col space-y-2 px-4 py-4">
            {navLinks.filter(l => l.always || user).map(link => (
              <Link
                key={link.to}
                to={link.to}
                className="text-gray-800 hover:text-green-600 font-bold uppercase tracking-widest py-1 border-b-2 border-transparent hover:border-green-600"
                style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.13em' }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            {/* Custom Profile Link for mobile */}
            {user && (
              <Link
                to={`/profile/${getFullUserId(user)}`}
                className="text-gray-800 hover:text-green-600 font-bold uppercase tracking-widest py-1 border-b-2 border-transparent hover:border-green-600"
                style={{ fontFamily: 'monospace', fontSize: '1rem', letterSpacing: '0.13em' }}
                onClick={() => setMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            <div className="border-t border-gray-200 my-2" />
            {user ? (
              <>
                <div className="flex items-center space-x-2 mb-2">
                  <div className="w-8 h-8 bg-green-500 text-white rounded flex items-center justify-center font-bold border border-gray-200" style={{ fontFamily: 'monospace' }}>
                    {getInitials(user.username)}
                  </div>
                  <span className="text-gray-800 text-sm font-bold" style={{ fontFamily: 'monospace' }}>{user.username.length > 10 ? user.username.substring(0, 10) + "..." : user.username}</span>
                </div>
                <button
                  onClick={() => { setMenuOpen(false); handleLogout(); }}
                  className="w-full px-3 py-2 rounded bg-green-500 text-white hover:bg-green-600 font-bold text-sm border border-gray-200"
                  style={{ fontFamily: 'monospace' }}
                >
                  LOGOUT
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="w-full text-gray-800 hover:text-green-600 px-3 py-2 rounded text-sm font-bold"
                  style={{ fontFamily: 'monospace' }}
                  onClick={() => setMenuOpen(false)}
                >
                  LOGIN
                </Link>
                <Link
                  to="/register"
                  className="w-full bg-green-500 text-white px-3 py-2 rounded hover:bg-green-600 text-sm font-bold"
                  style={{ fontFamily: 'monospace' }}
                  onClick={() => setMenuOpen(false)}
                >
                  REGISTER
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar; 
