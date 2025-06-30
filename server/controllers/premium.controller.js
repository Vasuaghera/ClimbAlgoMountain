const UserProfile = require('../models/UserProfile');
const razorpay = require('../config/razorpay');
const crypto = require('crypto');

// Premium game configurations
const PREMIUM_GAMES = {
    'binary-tree': {
        id: 'binary-tree',
        name: 'Binary Tree Adventure',
        description: 'Master binary tree data structures',
        price: 9.99,
        currency: 'INR'
    },
    'graph': {
        id: 'graph',
        name: 'Graph Explorer',
        description: 'Explore graph algorithms and traversal',
        price: 9.99,
        currency: 'INR'
    },
    'bundle': {
        id: 'bundle',
        name: 'Premium Bundle',
        description: 'Access to both Binary Tree and Graph games',
        price: 14.99,
        currency: 'INR',
        includes: ['binary-tree', 'graph']
    }
};

// Get premium games list
const getPremiumGames = async (req, res) => {
    try {
        const user = await UserProfile.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const gamesWithAccess = Object.values(PREMIUM_GAMES).map(game => ({
            ...game,
            hasAccess: user.hasGameAccess(game.id)
        }));

        res.json({
            games: gamesWithAccess,
            userAccess: user.premiumAccess,
            hasPremiumAccess: user.hasPremiumAccess
        });
    } catch (error) {
        console.error('Error fetching premium games:', error);
        res.status(500).json({ message: 'Error fetching premium games' });
    }
};

// Check if user has access to a specific game
const checkGameAccess = async (req, res) => {
    try {
        const { gameId } = req.params;
        const user = await UserProfile.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const hasAccess = user.hasGameAccess(gameId);
        const game = PREMIUM_GAMES[gameId];

        res.json({
            hasAccess,
            game: game || null,
            message: hasAccess ? 'Access granted' : 'Premium access required'
        });
    } catch (error) {
        console.error('Error checking game access:', error);
        res.status(500).json({ message: 'Error checking game access' });
    }
};

// Create payment intent for premium game access
const createPaymentIntent = async (req, res) => {
    try {
        const { gameId } = req.body;
        const user = await UserProfile.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if user already has access
        if (user.hasGameAccess(gameId)) {
            return res.status(400).json({ message: 'You already have access to this game' });
        }

        const game = PREMIUM_GAMES[gameId];
        if (!game) {
            return res.status(400).json({ message: 'Invalid game ID' });
        }

        // In a real application, you would integrate with Stripe or another payment processor
        // For now, we'll create a mock payment intent
        const paymentIntent = {
            id: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
            amount: Math.round(game.price * 100), // Convert to cents
            currency: game.currency,
            gameId: gameId,
            gameName: game.name,
            status: 'requires_payment_method'
        };

        res.json({
            clientSecret: paymentIntent.id,
            paymentIntent,
            game
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ message: 'Error creating payment intent' });
    }
};

// Handle successful payment and grant access
const handlePaymentSuccess = async (req, res) => {
    try {
        const { paymentIntentId, gameId, amount, paymentMethod = 'card' } = req.body;
        const user = await UserProfile.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const game = PREMIUM_GAMES[gameId];
        if (!game) {
            return res.status(400).json({ message: 'Invalid game ID' });
        }

        // Verify payment (in real app, verify with payment processor)
        // For now, we'll assume payment is successful

        // Add game access
        await user.addGameAccess(gameId);

        // Add to payment history
        user.paymentHistory.push({
            amount: amount || game.price,
            currency: game.currency,
            paymentMethod,
            status: 'completed',
            gameAccess: [gameId]
        });

        await user.save();

        res.json({
            message: 'Payment successful! Access granted.',
            game: game,
            userAccess: user.premiumAccess
        });
    } catch (error) {
        console.error('Error processing payment success:', error);
        res.status(500).json({ message: 'Error processing payment' });
    }
};

// Get user's premium access status
const getPremiumStatus = async (req, res) => {
    try {
        const user = await UserProfile.findById(req.user._id);
        
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            hasPremiumAccess: user.hasPremiumAccess,
            premiumAccess: user.premiumAccess,
            isSubscribed: user.isSubscribed,
            subscriptionType: user.subscriptionType,
            subscriptionEndDate: user.subscriptionEndDate,
            paymentHistory: user.paymentHistory
        });
    } catch (error) {
        console.error('Error fetching premium status:', error);
        res.status(500).json({ message: 'Error fetching premium status' });
    }
};

// Grant premium access (admin only)
const grantPremiumAccess = async (req, res) => {
    try {
        const { userId, gameId } = req.body;
        
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const user = await UserProfile.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.addGameAccess(gameId);

        res.json({
            message: 'Premium access granted successfully',
            userAccess: user.premiumAccess
        });
    } catch (error) {
        console.error('Error granting premium access:', error);
        res.status(500).json({ message: 'Error granting premium access' });
    }
};

// Revoke premium access (admin only)
const revokePremiumAccess = async (req, res) => {
    try {
        const { userId, gameId } = req.body;
        
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Admin access required' });
        }

        const user = await UserProfile.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await user.removeGameAccess(gameId);

        res.json({
            message: 'Premium access revoked successfully',
            userAccess: user.premiumAccess
        });
    } catch (error) {
        console.error('Error revoking premium access:', error);
        res.status(500).json({ message: 'Error revoking premium access' });
    }
};

// Create a Razorpay order for premium game access
const createRazorpayOrder = async (req, res) => {
    try {
        const { gameId } = req.body;
        const user = await UserProfile.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const game = PREMIUM_GAMES[gameId];
        if (!game) {
            return res.status(400).json({ message: 'Invalid game ID' });
        }
        // Create order
        const shortReceipt = `rcpt_${user._id}_${gameId}`.slice(0, 40);
        const options = {
            amount: Math.round(game.price * 100) * 100, // Razorpay expects paise
            currency: game.currency,
            receipt: shortReceipt,
            payment_capture: 1
        };
        try {
            const order = await razorpay.orders.create(options);
            res.json({
                orderId: order.id,
                amount: order.amount,
                currency: order.currency,
                game
            });
        } catch (razorpayError) {
            console.error('Razorpay order creation failed:', {
                options,
                error: razorpayError && razorpayError.error ? razorpayError.error : razorpayError
            });
            res.status(500).json({ message: 'Razorpay order creation failed', details: razorpayError && razorpayError.error ? razorpayError.error : razorpayError });
        }
    } catch (error) {
        console.error('Error creating Razorpay order:', error);
        res.status(500).json({ message: 'Error creating Razorpay order', details: error });
    }
};

// Verify Razorpay payment and grant access
const verifyRazorpayPayment = async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, gameId } = req.body;
        const user = await UserProfile.findById(req.user._id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        const game = PREMIUM_GAMES[gameId];
        if (!game) {
            return res.status(400).json({ message: 'Invalid game ID' });
        }
        // Verify signature
        const generated_signature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(razorpay_order_id + '|' + razorpay_payment_id)
            .digest('hex');
        if (generated_signature !== razorpay_signature) {
            return res.status(400).json({ message: 'Invalid payment signature' });
        }
        // Grant access
        let accessIds;
        if (gameId === 'bundle') {
            accessIds = ['binary-tree', 'graph'];
        } else {
            accessIds = [gameId];
        }
        for (const id of accessIds) {
            await user.addGameAccess(id);
        }
        user.paymentHistory.push({
            amount: game.price,
            currency: game.currency,
            paymentMethod: 'razorpay',
            status: 'completed',
            gameAccess: accessIds
        });
        await user.save();
        res.json({
            message: 'Payment verified and access granted!',
            game,
            userAccess: user.premiumAccess
        });
    } catch (error) {
        console.error('Error verifying Razorpay payment:', error);
        res.status(500).json({ message: 'Error verifying Razorpay payment' });
    }
};

module.exports = {
    getPremiumGames,
    checkGameAccess,
    createPaymentIntent,
    handlePaymentSuccess,
    getPremiumStatus,
    grantPremiumAccess,
    revokePremiumAccess,
    PREMIUM_GAMES,
    createRazorpayOrder,
    verifyRazorpayPayment
}; 