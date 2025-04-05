import nodemailer from 'nodemailer';

// Create a transporter with Gmail configuration
const createTransporter = async () => {
  try {
    // Use Gmail with app password for production email sending
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'ghilezan19@gmail.com',
        pass: 'zchtrurglmwmkwro', // App password
      },
    });

    // Verify the transporter configuration
    try {
      await transporter.verify();
      console.log('Gmail transporter verified and ready to send emails');
    } catch (verifyError) {
      console.error('Error verifying Gmail transporter:', verifyError);
      throw new Error('Gmail transporter verification failed: ' + verifyError.message);
    }
    
    return { 
      transporter,
      isGmail: true 
    };
  } catch (error) {
    console.error('Error creating Gmail transporter:', error);
    
    // Fall back to Ethereal email for testing if Gmail fails
    try {
      console.log('Falling back to Ethereal email for testing...');
      const testAccount = await nodemailer.createTestAccount();
      
      const testTransporter = nodemailer.createTransport({
        host: testAccount.smtp.host,
        port: testAccount.smtp.port,
        secure: testAccount.smtp.secure,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      
      return { 
        transporter: testTransporter, 
        testAccount,
        isGmail: false
      };
    } catch (fallbackError) {
      console.error('Error creating fallback email transporter:', fallbackError);
      // Return a fake transporter that logs emails instead of sending them
      const mockTransporter = {
        sendMail: (options) => {
          console.log('MOCK EMAIL SENDING (All transporters failed)');
          console.log('To:', options.to);
          console.log('Subject:', options.subject);
          console.log('Email body would contain order details');
          
          return Promise.resolve({
            messageId: 'mock-email-id-' + Date.now()
          });
        }
      };
      
      return { 
        transporter: mockTransporter,
        isGmail: false,
        isMock: true
      };
    }
  }
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order, customerEmail) => {
  try {
    const { transporter, testAccount, isGmail, isMock } = await createTransporter();
    
    // Ensure orderItems exists and is an array
    const orderItems = Array.isArray(order.orderItems) 
      ? order.orderItems.map(item => 
          `${item.name} (${item.selectedSize || 'One Size'}) × ${item.quantity} - $${(item.price * item.quantity).toFixed(2)}`
        ).join('\n')
      : 'Order details not available';
    
    // Calculate totals - with defaults if data is missing
    const subtotal = Array.isArray(order.orderItems)  
      ? order.orderItems.reduce((sum, item) => sum + ((item.price || 0) * (item.quantity || 1)), 0)
      : 0;
    const shipping = order.shippingPrice || 9.99;
    const tax = order.taxPrice || (subtotal * 0.08);
    const total = order.totalPrice || (subtotal + shipping + tax);
    
    // Ensure shipping address exists
    const shippingAddress = order.shippingAddress || {};
    
    // Create the email content
    const mailOptions = {
      from: '"CultureDrop Shop" <ghilezan19@gmail.com>',
      to: customerEmail || 'customer@example.com',
      subject: 'Order Confirmation - CultureDrop',
      text: `
        Thank you for your order from CultureDrop!
        
        Order Summary:
        --------------
        ${orderItems}
        
        Subtotal: $${subtotal.toFixed(2)}
        Shipping: $${shipping.toFixed(2)}
        Tax: $${tax.toFixed(2)}
        Total: $${total.toFixed(2)}
        
        Your order will be delivered to:
        ${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}
        ${shippingAddress.address || ''}
        ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}
        ${shippingAddress.country || ''}
        
        Payment Method: ${order.paymentMethod || 'Pay at Delivery'}
        
        If you have any questions about your order, please contact us.
        
        Thank you for shopping with CultureDrop!
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Thank you for your order from CultureDrop!</h2>
          
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h3 style="margin-top: 0;">Order Summary</h3>
            <ul style="list-style: none; padding: 0;">
              ${Array.isArray(order.orderItems) ? order.orderItems.map(item => `
                <li style="margin-bottom: 10px;">
                  <div style="display: flex; justify-content: space-between;">
                    <span>${item.name} (${item.selectedSize || 'One Size'}) × ${item.quantity}</span>
                    <span>$${((item.price || 0) * (item.quantity || 1)).toFixed(2)}</span>
                  </div>
                </li>
              `).join('') : '<li>Order details not available</li>'}
            </ul>
            
            <div style="margin-top: 20px; border-top: 1px solid #eee; padding-top: 10px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 5px;">
                <span>Shipping:</span>
                <span>$${shipping.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                <span>Tax:</span>
                <span>$${tax.toFixed(2)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; font-weight: bold; font-size: 1.1em; margin-top: 10px; border-top: 1px solid #eee; padding-top: 10px;">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>
              ${shippingAddress.firstName || ''} ${shippingAddress.lastName || ''}<br>
              ${shippingAddress.address || ''}<br>
              ${shippingAddress.city || ''}, ${shippingAddress.state || ''} ${shippingAddress.zip || ''}<br>
              ${shippingAddress.country || ''}
            </p>
          </div>
          
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h3 style="margin-top: 0;">Payment Method</h3>
            <p>${order.paymentMethod || 'Pay at Delivery'}</p>
          </div>
          
          <p>If you have any questions about your order, please contact us.</p>
          
          <p style="margin-top: 30px; text-align: center;">Thank you for shopping with CultureDrop!</p>
        </div>
      `,
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    if (isGmail) {
      console.log('Order confirmation email sent successfully via Gmail');
      console.log('Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'Gmail',
        // For Gmail, we don't have a preview URL, so we'll create a message for the user
        emailSent: true
      };
    } else if (isMock) {
      console.log('Mock email sending (no actual email sent)');
      
      return {
        success: false,
        error: 'Email configuration failed, email not sent',
        previewUrl: 'https://ethereal.email/message/demo'
      };
    } else {
      // Ethereal email used
      console.log('Order confirmation email sent successfully via Ethereal');
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Email preview URL: %s', previewUrl);
      
      return {
        success: true,
        previewUrl: previewUrl
      };
    }
  } catch (error) {
    console.error('Error sending order confirmation email:', error);
    // Return success anyway but with a flag that email failed
    // This ensures the order process continues even if email fails
    return { 
      success: false, 
      error: error.message,
      previewUrl: 'https://ethereal.email/message/demo'
    };
  }
};

// Send stock notification email
export const sendStockNotificationEmail = async (product, customerEmail) => {
  try {
    console.log('Preparing to send stock notification email to:', customerEmail);
    console.log('Product details:', {
      id: product._id,
      name: product.name,
      price: product.price,
      images: product.images
    });
    
    const { transporter, testAccount, isGmail, isMock } = await createTransporter();
    
    // Fix image path to handle both relative and absolute paths
    const imagePath = product.images && product.images.length > 0 
      ? (product.images[0].startsWith('http') 
          ? product.images[0] 
          : `http://localhost:8089${product.images[0]}`)
      : '';
      
    console.log('Using image path:', imagePath);
      
    // Create the email content
    const mailOptions = {
      from: '"CultureDrop Shop" <ghilezan19@gmail.com>',
      to: customerEmail,
      subject: `${product.name} is Back in Stock! - CultureDrop`,
      text: `
        Good news! The item you were waiting for is back in stock.
        
        Product: ${product.name}
        Price: $${product.price.toFixed(2)}
        
        You can now purchase this item on our website:
        http://localhost:8089/shop/product/${product._id}
        
        Thank you for your patience.
        
        - CultureDrop Team
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Good News - Item Back in Stock!</h2>
          
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <h3 style="margin-top: 0;">${product.name}</h3>
            <p>The item you requested to be notified about is now back in stock!</p>
            
            ${imagePath ? `
            <div style="margin: 15px 0; text-align: center;">
              <img src="${imagePath}" alt="${product.name}" style="max-width: 200px; margin: 0 auto; display: block;">
            </div>
            ` : ''}
            
            <p><strong>Price:</strong> $${product.price.toFixed(2)}</p>
            <p><strong>Category:</strong> ${product.category}</p>
            
            <div style="margin-top: 20px; text-align: center;">
              <a href="http://localhost:8089/shop/product/${product._id}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                View Product
              </a>
            </div>
          </div>
          
          <p>Thank you for your patience and interest in our products!</p>
          
          <p style="margin-top: 30px; text-align: center;">- CultureDrop Team</p>
        </div>
      `,
    };
    
    console.log('Sending email with options:', {
      to: mailOptions.to,
      subject: mailOptions.subject
    });
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sending result:', info);
    
    if (isGmail) {
      console.log('Stock notification email sent successfully via Gmail');
      console.log('Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'Gmail',
        emailSent: true
      };
    } else if (isMock) {
      console.log('Mock stock notification email (no actual email sent)');
      
      return {
        success: false,
        error: 'Email configuration failed, email not sent',
        previewUrl: 'https://ethereal.email/message/demo'
      };
    } else {
      // Ethereal email used
      console.log('Stock notification email sent successfully via Ethereal');
      const previewUrl = nodemailer.getTestMessageUrl(info);
      console.log('Email preview URL: %s', previewUrl);
      
      return {
        success: true,
        previewUrl: previewUrl
      };
    }
  } catch (error) {
    console.error('Error sending stock notification email:', error);
    return { 
      success: false, 
      error: error.message
    };
  }
};

// Send password reset email
export const sendPasswordResetEmail = async (email, resetUrl) => {
  try {
    const { transporter, testAccount, isGmail, isMock } = await createTransporter();
    
    // Create the email content
    const mailOptions = {
      from: '"CultureDrop" <ghilezan19@gmail.com>',
      to: email,
      subject: "Password Reset Request - CultureDrop",
      text: `
        You requested a password reset for your CultureDrop account.
        
        Please click the following link to reset your password:
        ${resetUrl}
        
        This link will expire in 1 hour.
        
        If you did not request this password reset, please ignore this email and your password will remain unchanged.
      `,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Password Reset Request</h2>
          
          <div style="margin: 20px 0; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
            <p>You requested a password reset for your CultureDrop account.</p>
            
            <p style="margin: 25px 0; text-align: center;">
              <a href="${resetUrl}" 
                 style="display: inline-block; padding: 12px 24px; background-color: #4F46E5; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                Reset Your Password
              </a>
            </p>
            
            <p style="color: #666; font-size: 0.9em;">This link will expire in 1 hour.</p>
            
            <p style="color: #666; font-size: 0.9em; margin-top: 20px;">
              If you did not request this password reset, please ignore this email and your password will remain unchanged.
            </p>
          </div>
          
          <p style="margin-top: 30px; text-align: center; color: #666; font-size: 0.9em;">
            &copy; ${new Date().getFullYear()} CultureDrop. All rights reserved.
          </p>
        </div>
      `,
    };
    
    // Send email
    const info = await transporter.sendMail(mailOptions);
    
    if (isGmail) {
      console.log('Password reset email sent successfully via Gmail');
      console.log('Message ID:', info.messageId);
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'Gmail',
      };
    } else if (isMock) {
      console.log('Mock password reset email "sent"');
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'Mock',
      };
    } else {
      // For Ethereal test accounts, return the preview URL
      console.log('Password reset email sent successfully via Ethereal');
      console.log('Message ID:', info.messageId);
      console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      
      return {
        success: true,
        messageId: info.messageId,
        provider: 'Ethereal',
        previewUrl: nodemailer.getTestMessageUrl(info),
      };
    }
  } catch (error) {
    console.error('Error sending password reset email:', error);
    return {
      success: false,
      error: error.message,
    };
  }
}; 