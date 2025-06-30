const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/connectDB');

// Load environment variables
dotenv.config();

// Create Express app
const app = express();
app.set('trust proxy', 1); // Enable trust proxy for rate limiting and proxies

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5000 // Increased limit to 2000 for development to avoid 429 errors
});
app.use(limiter);

// MongoDB Connection
connectDB();

// Routes
const authRoutes = require('./routes/auth.routes');
const userRoutes = require('./routes/user.routes');
const topicRoutes = require('./routes/topic.routes');
const gameProgressRoutes = require('./routes/gameProgress');
const leaderboardRoutes = require('./routes/leaderboard.routes');
const premiumRoutes = require('./routes/premium.routes');
const rewardsRoutes = require('./routes/rewards.routes');
const forumRoutes = require('./routes/forum.routes');
const chatbotRoutes = require('./routes/chatbot.routes');

// API Routess
app.use('/api/auth', authRoutes);
app.use('/api/user', userRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/game-progress', gameProgressRoutes);
app.use('/api/leaderboard', leaderboardRoutes);
app.use('/api/premium', premiumRoutes);
app.use('/api/rewards', rewardsRoutes);
app.use('/api/forum', forumRoutes);
app.use('/api/chatbot', chatbotRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// Add root route
app.get('/', (req, res) => {
  res.send('chalu chhe bhai');
});

// 404 handler
app.use((req, res) => { 
  res.status(404).json({ message: 'Route not found' });
});


// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 