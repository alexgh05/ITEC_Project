import StockNotification from '../models/StockNotification.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import mongoose from 'mongoose';
import { sendStockNotificationEmail } from '../utils/emailService.js';

// @desc    Subscribe to stock notifications for a product
// @route   POST /api/notifications/stock
// @access  Public
export const subscribeToStockNotification = async (req, res) => {
  try {
    const { email, productId } = req.body;
    console.log('Received stock notification request:', { email, productId });
    console.log('ProductID type:', typeof productId, 'value:', productId);

    if (!email || !productId) {
      console.log('Missing required fields:', { email, productId });
      return res.status(400).json({
        success: false,
        error: 'Please provide both email and productId'
      });
    }

    // Validate productId is a valid MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      console.log('Invalid ObjectId format:', productId);
      return res.status(400).json({
        success: false,
        error: 'Invalid product ID format'
      });
    }

    // Verify that the product exists and is out of stock
    console.log('Looking for product with ID:', productId);
    const product = await Product.findById(productId);
    console.log('Product found:', product ? 'Yes' : 'No');
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    if (product.countInStock > 0) {
      return res.status(400).json({
        success: false,
        error: 'This product is already in stock'
      });
    }

    // If user is authenticated, add to their notifications
    if (req.user) {
      // Check if user already has a notification for this product
      const userHasNotification = req.user.stockNotifications.some(
        notification => notification.product.toString() === productId
      );

      if (!userHasNotification) {
        // Add notification to user's profile
        await User.findByIdAndUpdate(
          req.user._id,
          { 
            $push: { 
              stockNotifications: { 
                product: productId 
              } 
            } 
          }
        );
      }

      return res.status(201).json({
        success: true,
        message: 'You will be notified when this product is back in stock',
        userNotification: true
      });
    }

    // For non-authenticated users, create a public notification entry
    // Use upsert to avoid duplicate entries for the same email/product
    const notification = await StockNotification.findOneAndUpdate(
      { email, product: productId },
      { email, product: productId, isNotified: false },
      { upsert: true, new: true, runValidators: true }
    );

    res.status(201).json({
      success: true,
      data: notification,
      message: 'You will be notified when this product is back in stock'
    });
  } catch (error) {
    console.error('Error subscribing to stock notification:', error);
    
    if (error.code === 11000) {
      // Duplicate key error (email already subscribed to this product)
      return res.status(400).json({
        success: false,
        error: 'You are already subscribed to notifications for this product'
      });
    }
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Process stock notifications when a product is back in stock
// @access  Internal function to be called when product stock is updated
export const processStockNotifications = async (productId) => {
  try {
    const product = await Product.findById(productId);
    
    if (!product || product.countInStock <= 0) {
      console.log('Product not found or still out of stock:', productId);
      return {
        success: false,
        message: 'Product not found or still out of stock'
      };
    }

    // Get all users who subscribed to this product's notifications
    const users = await User.find({
      'stockNotifications.product': productId
    });

    // Get all guest notifications for this product
    const guestNotifications = await StockNotification.find({
      product: productId,
      isNotified: false
    });

    console.log(`Found ${users.length} users and ${guestNotifications.length} guests waiting for stock notification`);

    // Process user notifications
    const userEmails = [];
    for (const user of users) {
      // Send email to user
      const emailResult = await sendStockNotificationEmail(product, user.email);
      if (emailResult.success) {
        userEmails.push(user.email);
      }

      // Remove this product from user's notification list
      await User.updateOne(
        { _id: user._id },
        { $pull: { stockNotifications: { product: productId } } }
      );
    }

    // Process guest notifications
    const guestEmails = [];
    for (const notification of guestNotifications) {
      // Send email to guest
      const emailResult = await sendStockNotificationEmail(product, notification.email);
      if (emailResult.success) {
        guestEmails.push(notification.email);
      }

      // Mark notification as sent
      notification.isNotified = true;
      await notification.save();
    }

    return {
      success: true,
      userNotifications: userEmails.length,
      guestNotifications: guestEmails.length,
      userEmails,
      guestEmails
    };
  } catch (error) {
    console.error('Error processing stock notifications:', error);
    return {
      success: false,
      error: error.message
    };
  }
}; 