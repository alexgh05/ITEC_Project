import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import stockNotificationRoutes from './routes/stockNotificationRoutes.js';
import Product from './models/Product.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

// Connect to MongoDB
let isDbConnected = false;
try {
  isDbConnected = await connectDB();
} catch (error) {
  console.error('Failed to initialize MongoDB connection:', error);
}

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Request logging middleware for debugging
app.use((req, res, next) => {
  if (req.path.includes('/notifications/stock')) {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
    console.log('Request body:', req.body);
  }
  next();
});

// Serve static files from the public directory
app.use(express.static(path.join(__dirname, '../public')));

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications/stock', stockNotificationRoutes);

// Simple route to test API
app.get('/', (req, res) => {
  res.json({ 
    message: 'API is running',
    dbStatus: isDbConnected ? 'connected' : 'disconnected' 
  });
});

// Sample data seeder route
app.get('/api/seed', async (req, res) => {
  if (!isDbConnected) {
    return res.status(503).json({ 
      message: 'Database not connected. Cannot seed data.' 
    });
  }

  try {
    // Clear existing products
    await Product.deleteMany({});
    
    // Sample products from Shop.tsx
    const products = [
      {
        name: 'Tokyo Neon Hoodie',
        price: 89.99,
        category: 'fashion',
        culture: 'Tokyo',
        images: ['/product-1a.jpg', '/product-1b.jpg'],
        description: 'Inspired by the neon-lit streets of Shibuya',
        countInStock: 25,
        isFeatured: true
      },
      {
        name: 'NYC Underground Vinyl',
        price: 29.99,
        category: 'music',
        culture: 'New York',
        images: ['/product-2a.jpg', '/product-2b.jpg'],
        description: 'Limited edition hip-hop vinyl straight from Brooklyn',
        countInStock: 15
      },
      {
        name: 'Lagos Beats Headphones',
        price: 129.99,
        category: 'accessories',
        culture: 'Lagos',
        images: ['/product-3a.jpg', '/product-3b.jpg'],
        description: 'Experience Afrobeats like never before'
      },
      {
        name: 'Seoul Streetwear Jacket',
        price: 149.99,
        category: 'fashion',
        culture: 'Seoul',
        images: ['/product-4a.jpg', '/product-4b.jpg'],
        description: 'K-pop inspired fashion statement piece'
      },
      {
        name: 'Tokyo Techno Vinyl',
        price: 34.99,
        category: 'music',
        culture: 'Tokyo',
        images: ['/product-5a.jpg', '/product-5b.jpg'],
        description: 'Cutting-edge electronic music from Tokyo\'s underground scene'
      },
      {
        name: 'New York Cap',
        price: 39.99,
        category: 'accessories',
        culture: 'New York',
        images: ['/product-6a.jpg', '/product-6b.jpg'],
        description: 'Classic New York streetwear cap'
      }
    ];
    
    // Insert products
    await Product.insertMany(products);
    
    res.json({ message: 'Sample data seeded successfully' });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    res.status(500).json({ message: 'Server Error' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database status: ${isDbConnected ? 'Connected' : 'Disconnected - Running in frontend-only mode'}`);
}); 