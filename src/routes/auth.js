const express = require('express');
const rateLimit = require('express-rate-limit');
const AuthService = require('../services/authService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    error: 'Too many authentication attempts',
    message: 'Please try again later'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Apply rate limiting to auth routes
router.use('/login', authLimiter);
router.use('/register', authLimiter);

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Basic validation
    if (!name || !email || !password) {
      return res.status(400).json({
        error: 'Missing required fields',
        message: 'Name, email, and password are required'
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        error: 'Invalid password',
        message: 'Password must be at least 6 characters long'
      });
    }

    const result = await AuthService.register({ name, email, password });
    
    res.status(201).json({
      message: 'User registered successfully',
      ...result
    });
  } catch (error) {
    res.status(400).json({
      error: 'Registration failed',
      message: error.message
    });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: 'Missing credentials',
        message: 'Email and password are required'
      });
    }

    const result = await AuthService.login(email, password);
    
    res.json({
      message: 'Login successful',
      ...result
    });
  } catch (error) {
    res.status(401).json({
      error: 'Login failed',
      message: error.message
    });
  }
});

// Get current user profile
router.get('/profile', authenticateToken, async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    res.json(user);
  } catch (error) {
    res.status(404).json({
      error: 'Profile not found',
      message: error.message
    });
  }
});

// Refresh token (optional - extends current token)
router.post('/refresh', authenticateToken, async (req, res) => {
  try {
    const user = await AuthService.getProfile(req.user.id);
    const newToken = AuthService.generateToken(user);
    
    res.json({
      message: 'Token refreshed',
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      },
      token: newToken
    });
  } catch (error) {
    res.status(400).json({
      error: 'Token refresh failed',
      message: error.message
    });
  }
});

// Logout (client-side - just remove token)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({
    message: 'Logout successful',
    instruction: 'Please remove the token from client storage'
  });
});

module.exports = router;
