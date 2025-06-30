import React, { createContext, useState, useContext, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    // Also remove the token from axios defaults on logout
    delete axios.defaults.headers.common['Authorization'];
  }, []); // Empty dependency array means this function is created once and is stable

  const fetchUserProfile = useCallback(async () => {
    console.log('fetchUserProfile called');
    try {
      const response = await axios.get(`${BACKEND_URL}/api/user/profile`);
      setUser(response.data.user);
      console.log('fetchUserProfile: setUser to', response.data.user);
      return response.data.user; // Return the latest user
    } catch (error) {
      console.error('Error fetching user profile:', error);
      // Only logout if it's an authentication error (e.g., token expired or invalid)
      if (error.response?.status === 401) {
        logout();
      } else {
        setError(error.response?.data?.message || error.message || 'Failed to fetch profile'); // Show backend error if available
      }
    } finally {
      setLoading(false);
    }
  }, [logout]);

  // Initialize auth state from localStorage and set axios default header
  useEffect(() => {
    console.log('Auth initialization effect running');
    const initializeAuth = async () => {
      const token = localStorage.getItem('token');
      console.log('AuthContext: token in localStorage =', token);
      if (token) {
        // Set the token in axios headers globally as soon as it's available
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await fetchUserProfile(); // Await the fetchUserProfile call
      } else {
        setLoading(false);
        // Ensure no Authorization header is set if no token
        delete axios.defaults.headers.common['Authorization'];
      }
    };

    initializeAuth();
  }, []); // Remove fetchUserProfile from dependencies to prevent infinite loop

  const login = useCallback(async (emailOrToken, passwordOrUser) => {
    try {
      setError(null);
      let response;
      
      // If first argument is a token, use direct login
      if (typeof emailOrToken === 'string' && emailOrToken.length > 50) {
        const token = emailOrToken;
        const user = passwordOrUser;
        localStorage.setItem('token', token);
        // Set the token in axios headers globally immediately after login
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(user);
        return user;
      }
      
      // Otherwise, perform email/password login
      response = await axios.post(`${BACKEND_URL}/api/auth/login`, {
        email: emailOrToken,
        password: passwordOrUser
      });

      // Extract token and user from the nested data structure
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      // Set the token in axios headers globally immediately after login
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed');
      throw error;
    }
  }, []);

  const register = useCallback(async (userData) => {
    try {
      setError(null);
      const response = await axios.post(`${BACKEND_URL}/api/auth/register`, userData);
      const { token, user } = response.data.data;
      localStorage.setItem('token', token);
      // Set the token in axios headers globally immediately after register
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      setUser(user);
      return user;
    } catch (error) {
      setError(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  }, []);

  const updateProfile = useCallback(async (profileData, isFormData = false) => {
    try {
      setError(null);
      let response;
      const token = localStorage.getItem('token');
      if (isFormData) {
        response = await axios.patch(
          `${BACKEND_URL}/api/user/profile`,
          profileData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'Authorization': `Bearer ${token}`
            }
          }
        );
      } else {
        response = await axios.patch(
          `${BACKEND_URL}/api/user/profile`,
          profileData,
          {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          }
        );
      }
      // Support both response formats
      setUser(response.data.data?.user || response.data.user);
      return response.data;
    } catch (error) {
      setError(error.response?.data?.message || 'Profile update failed');
      throw error;
    }
  }, []);

  // Expose a function to refresh user profile from backend
  const refreshUserProfile = fetchUserProfile;

  const value = useMemo(() => ({
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    refreshUserProfile,
    hasPremiumAccess: user?.hasPremiumAccess || false
  }), [user, loading, error, login, register, logout, updateProfile, refreshUserProfile , ]);

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 