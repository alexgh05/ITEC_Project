import express from 'express';
import {
  registerUser,
  loginUser,
  getUserProfile,
  addToWishlist,
  removeFromWishlist,
  addToCart,
  removeFromCart
} from '../controllers/userController.js';

const router = express.Router();

// Routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// These routes would normally require authentication middleware
// For simplicity, we're not implementing that here
router.get('/profile', getUserProfile);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:productId', removeFromWishlist);
router.post('/cart', addToCart);
router.delete('/cart/:productId', removeFromCart);

export default router; 