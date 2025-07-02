import { useState, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
// axios.defaults.baseURL = BACKEND_URL; // Remove this line to use relative paths

const useApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { logout } = useAuth();

  const request = useCallback(async (config) => {
    try {
      setLoading(true);
      setError(null);

      // Auth token is now handled globally by axios.defaults in AuthContext
      // No need to retrieve and set it here for every request.
      const response = await axios({
        ...config,
        // Headers can still be passed for specific requests, but Authorization is now global.
        headers: {
          ...config.headers,
          'Content-Type': 'application/json',
        },
      });

      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'An error occurred';
      setError(message);

      // Handle unauthorized errors
      if (error.response?.status === 401) {
        logout();
      }

      throw error;
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const get = useCallback((url, config = {}) => {
    return request({ ...config, method: 'GET', url });
  }, [request]);

  const post = useCallback((url, data, config = {}) => {
    return request({
      ...config,
      method: 'POST',
      url,
      data: typeof data === 'object' ? JSON.stringify(data) : data,
      headers: {
        ...(config.headers || {}),
        'Content-Type': 'application/json',
      },
    });
  }, [request]);

  const put = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'PUT', url, data });
  }, [request]);

  const patch = useCallback((url, data, config = {}) => {
    return request({ ...config, method: 'PATCH', url, data });
  }, [request]);

  const del = useCallback((url, config = {}) => {
    return request({ ...config, method: 'DELETE', url });
  }, [request]);

  return {
    loading,
    error,
    request,
    get,
    post,
    put,
    patch,
    del
  };
};

export default useApi; 