import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
export const createOrder = async (req, res) => {
  try {
    console.log('Creating order with request body:', JSON.stringify(req.body, null, 2));
    
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    } = req.body;
    
    if (!orderItems || orderItems.length === 0) {
      console.log('No order items provided');
      return res.status(400).json({
        success: false,
        error: 'No order items'
      });
    }

    // Fix the orderItems to include product IDs and prepare for stock updates
    const processedOrderItems = [];
    const productsToUpdate = [];
    
    for (const item of orderItems) {
      // Find the product by name if product ID is not provided
      if (!item.product) {
        const product = await Product.findOne({ name: item.name });
        if (!product) {
          return res.status(404).json({
            success: false,
            error: `Product not found: ${item.name}`
          });
        }
        
        // Check if product has enough stock
        if (product.countInStock < item.quantity) {
          return res.status(400).json({
            success: false,
            error: `Not enough ${product.name} in stock. Available: ${product.countInStock}`
          });
        }
        
        // Add product to update list
        productsToUpdate.push({
          productId: product._id,
          quantity: item.quantity
        });
        
        // Add the product ID to the order item
        processedOrderItems.push({
          ...item,
          product: product._id
        });
      } else {
        // If product ID is already provided, still check stock
        const product = await Product.findById(item.product);
        if (!product) {
          return res.status(404).json({
            success: false,
            error: `Product not found with ID: ${item.product}`
          });
        }
        
        // Check if product has enough stock
        if (product.countInStock < item.quantity) {
          return res.status(400).json({
            success: false,
            error: `Not enough ${product.name} in stock. Available: ${product.countInStock}`
          });
        }
        
        // Add product to update list
        productsToUpdate.push({
          productId: product._id,
          quantity: item.quantity
        });
        
        processedOrderItems.push(item);
      }
    }
    
    // Fix the shippingAddress to map zip to postalCode
    const processedShippingAddress = {
      ...shippingAddress,
      postalCode: shippingAddress.zip || shippingAddress.postalCode
    };
    
    // Check if user is authenticated
    if (!req.user || !req.user._id) {
      console.log('No authenticated user, creating guest order');
      // For guest checkout, create a temporary user ID
      const guestUserId = 'guest_' + Date.now();
      
      // Create response for guest checkout
      try {
        const customerEmail = shippingAddress.email || 'guest@example.com';
        console.log('Sending confirmation email to guest:', customerEmail);
        
        // Update product stock even for guest orders
        console.log('Reducing stock for guest order products');
        for (const update of productsToUpdate) {
          await Product.findByIdAndUpdate(
            update.productId,
            { $inc: { countInStock: -update.quantity } }
          );
          console.log(`Updated stock for product ${update.productId}, reduced by ${update.quantity}`);
        }
        
        const emailResult = await sendOrderConfirmationEmail(
          {
            orderItems: processedOrderItems,
            shippingAddress: processedShippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice
          },
          customerEmail
        );
        
        return res.status(201).json({
          success: true,
          data: {
            _id: 'temp_order_' + Date.now(),
            orderItems: processedOrderItems,
            shippingAddress: processedShippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
            user: guestUserId,
            createdAt: new Date().toISOString()
          },
          isGuest: true,
          emailSent: emailResult.success,
          emailPreviewUrl: emailResult.previewUrl,
          provider: emailResult.provider,
          message: 'Guest order created and product stock updated'
        });
      } catch (guestEmailError) {
        console.error('Error sending guest email:', guestEmailError);
        
        return res.status(201).json({
          success: true,
          data: {
            _id: 'temp_order_' + Date.now(),
            orderItems: processedOrderItems,
            shippingAddress: processedShippingAddress,
            paymentMethod,
            taxPrice,
            shippingPrice,
            totalPrice,
            user: guestUserId,
            createdAt: new Date().toISOString()
          },
          isGuest: true,
          emailSent: false,
          message: 'Guest order created and product stock updated but email failed'
        });
      }
    }
    
    // Create the order for authenticated users
    const order = await Order.create({
      user: req.user._id,
      orderItems: processedOrderItems,
      shippingAddress: processedShippingAddress,
      paymentMethod,
      taxPrice,
      shippingPrice,
      totalPrice
    });
    
    console.log('Order created successfully:', order._id);
    
    // Update product stock
    console.log('Reducing stock for order products');
    for (const update of productsToUpdate) {
      await Product.findByIdAndUpdate(
        update.productId,
        { $inc: { countInStock: -update.quantity } }
      );
      console.log(`Updated stock for product ${update.productId}, reduced by ${update.quantity}`);
    }
    
    // Send confirmation email
    try {
      const customerEmail = shippingAddress.email || req.user.email;
      console.log('Sending confirmation email to:', customerEmail);
      
      const emailResult = await sendOrderConfirmationEmail(
        {
          orderItems: processedOrderItems,
          shippingAddress: processedShippingAddress,
          paymentMethod,
          taxPrice,
          shippingPrice,
          totalPrice
        },
        customerEmail
      );
      
      console.log('Email result:', emailResult);
      
      res.status(201).json({
        success: true,
        data: order,
        emailSent: emailResult.success,
        emailPreviewUrl: emailResult.previewUrl, // For testing - provides a link to view the test email
        provider: emailResult.provider // Include the email provider in the response
      });
    } catch (emailError) {
      console.error('Error sending email but order was created:', emailError);
      // Still return success because the order was created
      res.status(201).json({
        success: true,
        data: order,
        emailSent: false,
        emailError: emailError.message
      });
    }
  } catch (error) {
    console.error('Order creation error:', error);
    
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(err => err.message);
      
      return res.status(400).json({
        success: false,
        error: messages
      });
    } else {
      res.status(500).json({
        success: false,
        error: 'Server Error: ' + error.message
      });
    }
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('orderItems.product');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    // Check if the logged in user is the owner of the order
    if (order.user._id.toString() !== req.user._id.toString()) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized'
      });
    }
    
    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
export const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('orderItems.product');
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update order to paid
// @route   PUT /api/orders/:id/pay
// @access  Private
export const updateOrderToPaid = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: req.body.id,
      status: req.body.status,
      update_time: req.body.update_time,
      email_address: req.body.payer.email_address
    };
    
    const updatedOrder = await order.save();
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update order to delivered
// @route   PUT /api/orders/:id/deliver
// @access  Private/Admin
export const updateOrderToDelivered = async (req, res) => {
  try {
    // Use findByIdAndUpdate instead of find + save to bypass validation
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      { 
        isDelivered: true, 
        deliveredAt: Date.now() 
      },
      { 
        new: true,      // Return the updated document
        runValidators: false  // Don't run validators when updating
      }
    ).populate('user', 'name email')
     .populate('orderItems.product');
    
    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        error: 'Order not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: updatedOrder
    });
  } catch (error) {
    console.error('Error updating order to delivered:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error: ' + error.message
    });
  }
};

// @desc    Get all orders
// @route   GET /api/orders/admin
// @access  Private/Admin
export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate('user', 'name email')
      .populate('orderItems.product')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
}; 