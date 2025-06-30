const jwt = require('jsonwebtoken');
const UserProfile = require('../models/UserProfile');

// Verify JWT token and attach full user object
const verifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ 
        message: 'No token provided',
        details: 'Please include an Authorization header with your request'
      });
    }
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ 
        message: 'Invalid token format',
        details: 'Token must be prefixed with "Bearer "'
      });
    }
    const token = authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ 
        message: 'Invalid token format',
        details: 'Token is missing after "Bearer "'
      });
    }
    
    // Use JWT_SECRET from environment or fallback for development
    const jwtSecret = process.env.JWT_SECRET || 'your_super_secret_jwt_key_here_please_change_in_production';
    
    const decoded = jwt.verify(token, jwtSecret);
    // Attach full user object
    const user = await UserProfile.findById(decoded.userId).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        message: 'Invalid token',
        details: 'The token provided is not valid'
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expired',
        details: 'Please login again to get a new token'
      });
    }
    res.status(500).json({ 
      message: 'Error verifying token', 
      error: error.message 
    });
  }
};

// Protected route wrapper (alias)
const protect = verifyToken;

module.exports = {
  verifyToken,
  protect
}; 