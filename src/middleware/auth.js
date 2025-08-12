const AuthService = require('../services/authService');

// Authentication middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        error: 'Access token required',
        message: 'Please provide a valid JWT token in Authorization header' 
      });
    }

    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(403).json({ 
      error: 'Invalid token',
      message: error.message 
    });
  }
};

// Optional authentication (for endpoints that work with or without auth)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = AuthService.verifyToken(token);
      req.user = decoded;
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Check if user owns resource or is admin
const checkResourceOwnership = (resourceUserField = 'userId') => {
  return (req, res, next) => {
    const resourceUserId = req.body[resourceUserField] || req.params[resourceUserField];
    
    if (req.user.id !== parseInt(resourceUserId)) {
      return res.status(403).json({ 
        error: 'Forbidden',
        message: 'You can only access your own resources' 
      });
    }
    next();
  };
};

module.exports = {
  authenticateToken,
  optionalAuth,
  checkResourceOwnership
};
