import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
// We'll need nodemailer for sending emails
import nodemailer from 'nodemailer';
import { sendPasswordResetEmail } from '../utils/emailService.js';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, 'your_jwt_secret', {
    expiresIn: '30d',
  });
};

// @desc    Register a user
// @route   POST /api/users/register
// @access  Public
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }
    
    // Check if user already exists
    const userExists = await User.findOne({ email });
    
    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }
    
    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Create user with hashed password
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || 'user', // Default to 'user' if role is not provided
    });
    
    if (user) {
      // Generate token
      const token = generateToken(user._id);
      
      console.log(`User registered successfully: ${email}`);
      
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    }
  } catch (error) {
    console.error('Register error:', error);
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
    
    // Input validation
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password'
      });
    }
    
    // Find user by email
    const user = await User.findOne({ email }).select('+password');
    
    if (!user) {
      console.log(`Login attempt failed: User with email ${email} not found`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    // Check if password matches
    // Use direct bcrypt comparison instead of the model method for debugging
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
      console.log(`Login attempt failed: Password does not match for user ${email}`);
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials'
      });
    }
    
    console.log(`User successfully logged in: ${email}`);
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Login error:', error);
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

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('+password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found'
      });
    }
    
    const { name, email, currentPassword, newPassword } = req.body;
    
    // Update basic information
    if (name) user.name = name;
    if (email) user.email = email;
    
    // Update password if provided
    if (newPassword && currentPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: 'Current password is incorrect'
        });
      }
      
      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
      console.log(`Password updated for user: ${user.email}`);
    }
    
    await user.save();
    
    res.status(200).json({
      success: true,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Request password reset
// @route   POST /api/users/forgot-password
// @access  Public
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Find user by email
    const user = await User.findOne({ email });
    
    if (!user) {
      // For security reasons, still return a success response even if the email doesn't exist
      return res.status(200).json({
        success: true,
        message: 'If your email is registered, you will receive a password reset link shortly'
      });
    }
    
    // Generate random reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    
    // Set reset token and expiry on user document
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; // Token valid for 1 hour
    
    await user.save();
    
    // Create reset URL - update to use client URL instead of server
    // Using a frontend URL with proper port number (from the terminal output I can see it's running on 8107)
    const clientHost = process.env.CLIENT_URL || 'http://localhost:8107';
    const resetUrl = `${clientHost}/reset-password?token=${resetToken}`;
    
    // Send the password reset email using our email service
    const emailResult = await sendPasswordResetEmail(email, resetUrl);
    
    // Log email sending results
    console.log(`Password reset email ${emailResult.success ? 'sent' : 'failed'} for: ${email}`);
    if (emailResult.messageId) {
      console.log(`Message ID: ${emailResult.messageId}`);
    }
    
    // Send response
    res.status(200).json({
      success: true,
      message: 'If your email is registered, you will receive a password reset link shortly',
      previewUrl: emailResult.previewUrl // Only for development with Ethereal
    });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Reset password
// @route   POST /api/users/reset-password
// @access  Public
export const resetPasswordWithToken = async (req, res) => {
  try {
    const { token, password } = req.body;
    
    if (!token || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide token and new password'
      });
    }
    
    // Find user with the given reset token and check if it's still valid
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() }
    });
    
    if (!user) {
      console.log('Password reset failed: Invalid or expired token');
      return res.status(400).json({
        success: false,
        error: 'Password reset token is invalid or has expired'
      });
    }
    
    // Hash the new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    
    // Set new password
    user.password = hashedPassword;
    
    // Clear reset token fields
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    
    await user.save();
    
    // Log success
    console.log(`Password reset successful for user: ${user.email}`);
    
    res.status(200).json({
      success: true,
      message: 'Password has been successfully updated'
    });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// Google authentication functions
// @desc    Login with Google OAuth
// @route   POST /api/users/google/login
// @access  Public
export const loginWithGoogle = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        error: 'Google credential is required'
      });
    }
    
    // In a production app, you would verify the Google token
    // using the Google Auth Library:
    // const ticket = await client.verifyIdToken({...});
    // const payload = ticket.getPayload();
    
    // For now, we'll decode the JWT to get the payload (not secure for production)
    const tokenParts = credential.split('.');
    if (tokenParts.length !== 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token format'
      });
    }
    
    // Decode the payload (2nd part of JWT)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    // Check if this Google user already exists in our database
    let user = await User.findOne({ email: payload.email });
    
    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'No account found with this Google email. Please register first.'
      });
    }
    
    // Generate token
    const token = generateToken(user._id);
    
    res.status(200).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token
      }
    });
  } catch (error) {
    console.error('Google login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Register with Google OAuth
// @route   POST /api/users/google/register
// @access  Public
export const registerWithGoogle = async (req, res) => {
  try {
    const { credential, role } = req.body;
    
    if (!credential) {
      return res.status(400).json({
        success: false,
        error: 'Google credential is required'
      });
    }
    
    // In a production app, you would verify the Google token
    // using the Google Auth Library:
    // const ticket = await client.verifyIdToken({...});
    // const payload = ticket.getPayload();
    
    // For now, we'll decode the JWT to get the payload (not secure for production)
    const tokenParts = credential.split('.');
    if (tokenParts.length !== 3) {
      return res.status(400).json({
        success: false,
        error: 'Invalid token format'
      });
    }
    
    // Decode the payload (2nd part of JWT)
    const payload = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
    
    // Check if this Google user already exists in our database
    let user = await User.findOne({ email: payload.email });
    
    if (user) {
      // User already exists, just login instead
      // Generate token
      const token = generateToken(user._id);
      
      return res.status(200).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    }
    
    // Create a new user with Google profile data
    // Generate a secure random password (user won't need to know this)
    const randomPassword = crypto.randomBytes(16).toString('hex');
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(randomPassword, salt);
    
    user = await User.create({
      name: payload.name,
      email: payload.email,
      password: hashedPassword,
      role: role || 'user',
    });
    
    if (user) {
      // Generate token
      const token = generateToken(user._id);
      
      res.status(201).json({
        success: true,
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          token
        }
      });
    }
  } catch (error) {
    console.error('Google registration error:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 