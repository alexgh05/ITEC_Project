import Product from '../models/Product.js';
import User from '../models/User.js';
import Order from '../models/Order.js';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import StoreSettings from '../models/StoreSettings.js';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, '../../public/uploads');
    // Create directory if it doesn't exist
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// Create multer upload instance
const uploadConfig = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    
    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  }
}).single('image');

// @desc    Get admin dashboard statistics
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getAdminStats = async (req, res) => {
  try {
    // Get total revenue from completed orders
    const orders = await Order.find({ isPaid: true });
    const totalRevenue = orders.reduce((acc, order) => acc + order.totalPrice, 0);
    
    // Count customers (users)
    const userCount = await User.countDocuments({ role: 'user' });
    
    // Count products
    const productCount = await Product.countDocuments();
    
    // Count all orders
    const orderCount = await Order.countDocuments();
    
    // Count pending orders
    const pendingOrderCount = await Order.countDocuments({ isPaid: false });
    
    // Get product counts by category
    const products = await Product.find();
    const categories = {};
    products.forEach(product => {
      const category = product.category || 'Uncategorized';
      if (categories[category]) {
        categories[category]++;
      } else {
        categories[category] = 1;
      }
    });
    
    // Calculate monthly revenue (for the past 6 months)
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    
    const paidOrders = await Order.find({
      isPaid: true,
      paidAt: { $gte: sixMonthsAgo }
    });
    
    const monthlyRevenue = {};
    paidOrders.forEach(order => {
      const date = new Date(order.paidAt);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      
      if (monthlyRevenue[monthYear]) {
        monthlyRevenue[monthYear] += order.totalPrice;
      } else {
        monthlyRevenue[monthYear] = order.totalPrice;
      }
    });
    
    // Get recent products (last 10)
    const recentProducts = await Product.find()
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get recent orders (last 10)
    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .populate('user', 'name email');
    
    // Calculate revenue change percentage (compared to previous month)
    const currentMonth = new Date().getMonth();
    const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
    const currentYear = new Date().getFullYear();
    const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;
    
    const currentMonthKey = `${currentMonth + 1}/${currentYear}`;
    const previousMonthKey = `${previousMonth + 1}/${previousYear}`;
    
    const currentMonthRevenue = monthlyRevenue[currentMonthKey] || 0;
    const previousMonthRevenue = monthlyRevenue[previousMonthKey] || 0;
    
    let revenueChangePercent = 0;
    if (previousMonthRevenue > 0) {
      revenueChangePercent = ((currentMonthRevenue - previousMonthRevenue) / previousMonthRevenue) * 100;
    }
    
    res.status(200).json({
      success: true,
      data: {
        totalRevenue,
        userCount,
        productCount,
        orderCount,
        pendingOrderCount,
        categories,
        monthlyRevenue,
        recentProducts,
        recentOrders,
        revenueChangePercent
      }
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all users (customers)
// @route   GET /api/admin/users
// @access  Private/Admin
export const getAdminUsers = async (req, res) => {
  try {
    // Find all users and sort by most recent first
    const users = await User.find({})
      .sort({ createdAt: -1 })
      .select('-password'); // Exclude passwords from results
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Upload product image
// @route   POST /api/admin/upload
// @access  Private/Admin
export const uploadProductImage = async (req, res) => {
  uploadConfig(req, res, async (err) => {
    try {
      if (err) {
        console.error('Upload error:', err);
        return res.status(400).json({
          success: false,
          error: err.message
        });
      }

      if (!req.file) {
        return res.status(400).json({
          success: false,
          error: 'No file uploaded'
        });
      }

      // Create public URL path for the image
      const imagePath = `/uploads/${path.basename(req.file.path)}`;
      
      // Update product if productId is provided
      const { productId, imageIndex } = req.body;
      
      if (productId) {
        try {
          const product = await Product.findById(productId);
          
          if (!product) {
            return res.status(404).json({
              success: false,
              error: 'Product not found'
            });
          }
          
          // Initialize images array if it doesn't exist
          if (!product.images) {
            product.images = [];
          }
          
          // Handle image based on the imageIndex parameter
          if (imageIndex !== undefined) {
            const index = parseInt(imageIndex, 10);
            console.log(`Adding image at index ${index}:`, imagePath);
            
            // Ensure we have enough elements in the array
            while (product.images.length <= index) {
              product.images.push('');
            }
            
            // Set the image at the specified index
            product.images[index] = imagePath;
          } else {
            // Default behavior: add to the end of array
            product.images.push(imagePath);
          }
          
          await product.save();
          
          return res.status(200).json({
            success: true,
            imageUrl: imagePath,
            product
          });
        } catch (error) {
          console.error('Product update error:', error);
          return res.status(500).json({
            success: false,
            error: 'Failed to update product'
          });
        }
      }
      
      // Just return the image URL if no product ID
      return res.status(200).json({
        success: true,
        imageUrl: imagePath
      });
    } catch (error) {
      console.error('Server error during upload:', error);
      return res.status(500).json({
        success: false,
        error: 'Server error during upload'
      });
    }
  });
};

// @desc    Get store settings
// @route   GET /api/admin/settings
// @access  Private/Admin
export const getStoreSettings = async (req, res) => {
  try {
    // Get the singleton store settings document
    const settings = await StoreSettings.getSingleton();
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error('Error fetching store settings:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update store settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
export const updateStoreSettings = async (req, res) => {
  try {
    const updatedSettings = req.body;
    
    // Validate required fields
    if (!updatedSettings.storeName) {
      return res.status(400).json({
        success: false,
        error: 'Store name is required'
      });
    }
    
    // Get the singleton store settings document
    const existingSettings = await StoreSettings.getSingleton();
    
    // Update each field
    existingSettings.storeName = updatedSettings.storeName;
    existingSettings.storeEmail = updatedSettings.storeEmail;
    existingSettings.storePhone = updatedSettings.storePhone;
    existingSettings.storeLogo = updatedSettings.storeLogo;
    existingSettings.storeAddress = updatedSettings.storeAddress;
    
    // Update nested objects
    existingSettings.socialLinks = updatedSettings.socialLinks;
    existingSettings.shipping = updatedSettings.shipping;
    existingSettings.payment = updatedSettings.payment;
    
    // Update the timestamp
    existingSettings.updatedAt = Date.now();
    
    // Save to database
    await existingSettings.save();
    
    res.status(200).json({
      success: true,
      message: 'Store settings updated successfully',
      data: existingSettings
    });
  } catch (error) {
    console.error('Error updating store settings:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 