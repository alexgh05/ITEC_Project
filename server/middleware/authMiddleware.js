import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Protect routes - middleware to check if user is authenticated
export const protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }

    try {
      // Verify token
      // In a real app, you would use a proper JWT_SECRET from environment variables
      const decoded = jwt.verify(token, 'your_jwt_secret');

      // Set req.user to the authenticated user
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Optional auth middleware - tries to authenticate but continues if not authenticated
export const optionalAuth = async (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // If no token, continue without setting req.user
    if (!token) {
      return next();
    }

    try {
      // Verify token
      const decoded = jwt.verify(token, 'your_jwt_secret');

      // Set req.user to the authenticated user
      req.user = await User.findById(decoded.id).select('-password');
    } catch (error) {
      // Token verification failed, but we'll continue anyway
      console.log('Token verification failed in optionalAuth:', error.message);
    }

    // Always continue to next middleware
    next();
  } catch (error) {
    console.error('Server error in optionalAuth:', error);
    // Continue even if there's an error
    next();
  }
};

// Admin middleware - check if user has admin role
export const admin = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({
      success: false,
      error: 'Not authorized as admin'
    });
  }
}; 