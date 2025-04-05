import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  updateUserProfile,
  forgotPassword,
  resetPasswordWithToken,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart,
  loginWithGoogle,
  registerWithGoogle
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPasswordWithToken);

// Google OAuth routes
router.post('/google/login', loginWithGoogle);
router.post('/google/register', registerWithGoogle);

// Protected routes - require authentication
router.get('/profile', protect, getUserProfile);
router.put('/profile', protect, updateUserProfile);
router.post('/wishlist', protect, addToWishlist);
router.delete('/wishlist/:productId', protect, removeFromWishlist);
router.post('/cart', protect, addToCart);
router.delete('/cart/:productId', protect, removeFromCart);

export default router; 