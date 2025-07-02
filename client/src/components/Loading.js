import React from 'react';

// Simple green spinning circle loader
const SimpleSpinner = ({ size = 'medium' }) => {
  const sizeClasses = {
    small: 'w-6 h-6',
    medium: 'w-8 h-8', 
    large: 'w-12 h-12',
    xlarge: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} border-2 border-gray-200 border-t-green-600 rounded-full animate-spin`}></div>
  );
};

// Simple loading component with just spinner and optional text
const Loading = ({ 
  size = 'medium', 
  text = 'Loading...', 
  fullScreen = false,
  customText = null 
}) => {
  
  // Size classes
  const sizeClasses = {
    small: 'w-8 h-8',
    medium: 'w-16 h-16', 
    large: 'w-32 h-32',
    xlarge: 'w-48 h-48'
  };

  // Loading content
  const LoadingContent = () => (
    <div className="text-center">
      <div className="relative">
        {/* Simple Green Spinning Circle */}
        <div className={`${sizeClasses[size]} mx-auto mb-6 relative`}>
          <div className="absolute inset-0 border-4 border-gray-200 rounded-full"></div>
          <div className="absolute inset-0 border-4 border-transparent border-t-green-600 rounded-full animate-spin"></div>
        </div>
        
        {/* Loading Text */}
        {customText ? (
          <div className="font-mono text-lg font-semibold text-green-600">
            {customText}
          </div>
        ) : (
          <div className="font-mono text-lg font-semibold text-green-600">
            {text}
          </div>
        )}
      </div>
    </div>
  );

  // Full screen wrapper
  if (fullScreen) {
    return (
      <div className="fixed inset-0 bg-white bg-opacity-90 flex items-center justify-center z-50">
        <LoadingContent />
      </div>
    );
  }

  // Inline loading
  return <LoadingContent />;
};

// Specialized loading components
export const DashboardLoading = () => (
  <Loading 
    fullScreen={true}
    customText="Loading Your DSA Journey..."
    size="large"
  />
);

export const GameLoading = () => (
  <Loading 
    fullScreen={true}
    customText="Loading Game..."
    size="large"
  />
);

export const AuthLoading = () => (
  <Loading 
    fullScreen={true}
    customText="Authenticating..."
    size="medium"
  />
);

export const LeaderboardLoading = () => (
  <Loading 
    fullScreen={true}
    customText="Loading Leaderboard..."
    size="medium"
  />
);

export const DataLoading = () => (
  <Loading 
    fullScreen={true}
    customText="Loading Rewards..."
    size="medium"
  />
);

export const FriendsLoading = () => (
  <Loading 
    fullScreen={true}
    customText="Loading Friends..."
    size="medium"
  />
);

export const ProfileLoading = () => (
  <Loading 
    fullScreen={true}
    customText="Loading Profile..."
    size="medium"
  />
);

export const ButtonLoading = () => (
  <SimpleSpinner size="small" />
);

export const InlineLoading = ({ text, size }) => (
  <Loading 
    text={text}
    size={size}
  />
);

export const QALoading = () => (
  <Loading 
    fullScreen={true}
    customText="Loading Q&A..."
    size="large"
  />
);

// Export the simple spinner for direct use
export { SimpleSpinner };

export default Loading; 