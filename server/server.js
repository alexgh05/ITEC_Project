import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import productRoutes from './routes/productRoutes.js';
import userRoutes from './routes/userRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import Product from './models/Product.js';

dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);

// Simple route to test API
app.get('/', (req, res) => {
  res.json({ message: 'API is running' });
});

// Sample data seeder route
app.get('/api/seed', async (req, res) => {
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
        isFeatured: true
      },
      {
        name: 'NYC Underground Vinyl',
        price: 29.99,
        category: 'music',
        culture: 'New York',
        images: ['/product-2a.jpg', '/product-2b.jpg'],
        description: 'Limited edition hip-hop vinyl straight from Brooklyn'
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
}); 