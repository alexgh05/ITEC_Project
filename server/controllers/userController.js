import User from '../models/User.js';

// @desc    Register a user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Create user
    const user = await User.create({
      name,
      email,
      password, // In a real app, you'd encrypt this password
    });
    
    if (user) {
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    }
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

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // In a real app, you'd check if password matches here
    // For now, we'll just assume it matches
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (user) {
      res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email
        }
      });
    } else {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add product to wishlist
// @route   POST /api/users/wishlist
// @access  Private
export const addToWishlist = async (req, res) => {
  try {
    const { productId } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if product is already in wishlist
    if (user.wishlist.includes(productId)) {
      return res.status(400).json({
        success: false,
        error: 'Product already in wishlist'
      });
    }
    
    user.wishlist.push(productId);
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Remove product from wishlist
// @route   DELETE /api/users/wishlist/:productId
// @access  Private
export const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.wishlist = user.wishlist.filter(
      id => id.toString() !== req.params.productId
    );
    
    await user.save();
    
    res.status(200).json({
      success: true,
      data: user.wishlist
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Add product to cart
// @route   POST /api/users/cart
// @access  Private
export const addToCart = async (req, res) => {
  try {
    const { productId, quantity } = req.body;
    
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    // Check if product is already in cart
    const existingCartItem = user.cart.find(
      item => item.product.toString() === productId
    );
    
    if (existingCartItem) {
      // Update quantity if product exists
      existingCartItem.quantity = quantity || existingCartItem.quantity + 1;
    } else {
      // Add new product to cart
      user.cart.push({
        product: productId,
        quantity: quantity || 1
      });
    }
    
    await user.save();
    
    // Populate product details
    const populatedUser = await User.findById(req.user._id).populate('cart.product');
    
    res.status(200).json({
      success: true,
      data: populatedUser.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/users/cart/:productId
// @access  Private
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    user.cart = user.cart.filter(
      item => item.product.toString() !== req.params.productId
    );
    
    await user.save();
    
    // Populate product details
    const populatedUser = await User.findById(req.user._id).populate('cart.product');
    
    res.status(200).json({
      success: true,
      data: populatedUser.cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 