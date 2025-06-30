import { useState, useCallback } from 'react';

// Custom hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [loadingText, setLoadingText] = useState('Loading...');

  // Start loading with optional custom text
  const startLoading = useCallback((text = 'Loading...') => {
    setIsLoading(true);
    setLoadingText(text);
  }, []);

  // Stop loading
  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText('Loading...');
  }, []);

  // Execute async function with loading state
  const withLoading = useCallback(async (asyncFunction, loadingMessage = 'Loading...') => {
    try {
      startLoading(loadingMessage);
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  // Execute multiple async functions with loading state
  const withMultipleLoading = useCallback(async (asyncFunctions, loadingMessage = 'Loading...') => {
    try {
      startLoading(loadingMessage);
      const results = await Promise.all(asyncFunctions);
      return results;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    loadingText,
    startLoading,
    stopLoading,
    withLoading,
    withMultipleLoading
  };
};

// Hook for managing multiple loading states
export const useMultipleLoading = (loadingKeys = []) => {
  const [loadingStates, setLoadingStates] = useState(
    loadingKeys.reduce((acc, key) => ({ ...acc, [key]: false }), {})
  );

  const startLoading = useCallback((key) => {
    setLoadingStates(prev => ({ ...prev, [key]: true }));
  }, []);

  const stopLoading = useCallback((key) => {
    setLoadingStates(prev => ({ ...prev, [key]: false }));
  }, []);

  const isLoading = useCallback((key) => {
    return loadingStates[key] || false;
  }, [loadingStates]);

  const isAnyLoading = useCallback(() => {
    return Object.values(loadingStates).some(state => state);
  }, [loadingStates]);

  const withLoading = useCallback(async (key, asyncFunction) => {
    try {
      startLoading(key);
      const result = await asyncFunction();
      return result;
    } finally {
      stopLoading(key);
    }
  }, [startLoading, stopLoading]);

  return {
    loadingStates,
    startLoading,
    stopLoading,
    isLoading,
    isAnyLoading,
    withLoading
  };
};

// Hook for managing loading with error handling
export const useLoadingWithError = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);
  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState('Loading...');

  const startLoading = useCallback((text = 'Loading...') => {
    setIsLoading(true);
    setError(null);
    setLoadingText(text);
  }, []);

  const stopLoading = useCallback(() => {
    setIsLoading(false);
    setLoadingText('Loading...');
  }, []);

  const setErrorState = useCallback((errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const withLoading = useCallback(async (asyncFunction, loadingMessage = 'Loading...') => {
    try {
      startLoading(loadingMessage);
      const result = await asyncFunction();
      setError(null);
      return result;
    } catch (err) {
      setError(err.message || 'An error occurred');
      throw err;
    } finally {
      stopLoading();
    }
  }, [startLoading, stopLoading]);

  return {
    isLoading,
    error,
    loadingText,
    startLoading,
    stopLoading,
    setErrorState,
    clearError,
    withLoading
  };
}; 