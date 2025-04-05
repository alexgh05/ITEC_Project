import Product from '../models/Product.js';
import { processStockNotifications } from './stockNotificationController.js';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req, res) => {
  try {
    const category = req.query.category;
    const culture = req.query.culture;
    
    let filter = {};
    
    if (category && category.toLowerCase() !== 'all') {
      filter.category = category.toLowerCase();
    }
    
    if (culture && culture !== 'All') {
      filter.culture = culture;
    }
    
    const products = await Product.find(filter);
    
    res.status(200).json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
export const getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    
    res.status(201).json({
      success: true,
      data: product
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req, res) => {
  try {
    let product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }

    // Check if stock is being updated from 0 to a positive number
    const wasOutOfStock = product.countInStock <= 0;
    const willBeInStock = req.body.countInStock > 0;
    const stockNotificationsNeeded = wasOutOfStock && willBeInStock;
    
    console.log('Stock update check:', { 
      productId: product._id,
      productName: product.name,
      previousStock: product.countInStock, 
      newStock: req.body.countInStock,
      wasOutOfStock,
      willBeInStock,
      stockNotificationsNeeded
    });
    
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // If product was out of stock and is now in stock, process notifications
    if (stockNotificationsNeeded) {
      console.log(`Product ${product._id} (${product.name}) is back in stock. Processing notifications...`);
      try {
        const notificationResult = await processStockNotifications(product._id);
        console.log('Stock notifications processed:', notificationResult);
        
        if (!notificationResult.success) {
          console.error('Stock notification processing was not successful:', notificationResult.error);
        } else {
          console.log(`Sent ${notificationResult.userNotifications + notificationResult.guestNotifications} notifications`);
          if (notificationResult.userEmails.length > 0) {
            console.log('User emails notified:', notificationResult.userEmails);
          }
          if (notificationResult.guestEmails.length > 0) {
            console.log('Guest emails notified:', notificationResult.guestEmails);
          }
        }
      } catch (notificationError) {
        console.error('Error processing stock notifications:', notificationError);
      }
    }
    
    res.status(200).json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error'
      });
    }
  }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        error: 'Product not found'
      });
    }
    
    await product.deleteOne();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  }
  catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 