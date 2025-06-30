const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth.middleware');
const {
    checkGameAccess,
    createRazorpayOrder,
    verifyRazorpayPayment
} = require('../controllers/premium.controller');

// Check if user has access to a specific game
router.get('/access/:gameId', verifyToken, checkGameAccess);

// Razorpay endpoints
router.post('/razorpay/order', verifyToken, createRazorpayOrder);
router.post('/razorpay/verify', verifyToken, verifyRazorpayPayment);

module.exports = router; 