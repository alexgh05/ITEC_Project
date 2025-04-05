import express from 'express';
import {
  createOrder,
  getOrderById,
  getUserOrders,
  updateOrderToPaid,
  updateOrderToDelivered,
  getAllOrders
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Add a modified version of the protect middleware for guest checkouts
const optionalAuth = (req, res, next) => {
  try {
    let token;

    // Check for token in headers
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
      
      try {
        // Verify token
        const jwt = require('jsonwebtoken');
        const decoded = jwt.verify(token, 'your_jwt_secret');
        
        // Set req.user to the authenticated user
        const User = require('../models/User.js').default;
        User.findById(decoded.id).select('-password')
          .then(user => {
            req.user = user;
            next();
          })
          .catch(err => {
            console.log('Error finding user, proceeding as guest:', err.message);
            next(); // Continue as guest
          });
      } catch (error) {
        console.log('Token verification failed, proceeding as guest:', error.message);
        next(); // Continue as guest
      }
    } else {
      // No token, proceed as guest
      next();
    }
  } catch (error) {
    console.error('Error in optionalAuth middleware:', error);
    next(); // Continue as guest
  }
};

// Routes
// Add both protected and guest routes for order creation
router.route('/').post(protect, createOrder); // For authenticated users
router.route('/guest').post(createOrder); // For guest checkout

router.route('/myorders').get(protect, getUserOrders);
router.route('/admin').get(protect, admin, getAllOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);

// Add a test route for debugging - should be removed in production
router.route('/test/:id/deliver').put(async (req, res) => {
  try {
    console.log('Order Delivery Request:');
    console.log(`  - URL: ${req.originalUrl}`);
    console.log(`  - Method: ${req.method}`);
    console.log(`  - User: Not authenticated yet`); 
    console.log(`  - Headers: ${JSON.stringify(req.headers)}`);
    console.log(`  - Body: ${JSON.stringify(req.body)}`);
    
    const orderId = req.params.id;
    console.log(`Testing order delivery update for ID: ${orderId}`);
    
    const Order = (await import('../models/Order.js')).default;
    const order = await Order.findById(orderId);
    
    if (!order) {
      console.log(`Test endpoint: Order not found with ID: ${orderId}`);
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    console.log(`Test endpoint: Found order: ${order._id}`);
    
    try {
      // Use findByIdAndUpdate instead of save to bypass validation
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        { 
          isDelivered: true, 
          deliveredAt: new Date() 
        },
        { 
          new: true,
          runValidators: false
        }
      );
      
      console.log(`Test endpoint: Successfully updated order to delivered`);
      
      return res.status(200).json({
        success: true,
        message: 'Order updated to delivered successfully',
        data: updatedOrder
      });
    } catch (updateError) {
      console.log(`Test endpoint: Error updating order to delivered: ${updateError}`);
      return res.status(500).json({
        success: false,
        error: `Error updating order: ${updateError.message}`
      });
    }
  } catch (error) {
    console.error(`Test endpoint error: ${error}`);
    return res.status(500).json({
      success: false,
      error: `Server error: ${error.message}`
    });
  }
});

export default router; 