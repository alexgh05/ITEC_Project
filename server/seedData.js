import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import Product from './models/Product.js';
import User from './models/User.js';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Update MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/culture-drop-shop';

// Connect to MongoDB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(MONGO_URI);
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Sample products data
const productData = [
  {
    name: 'Tokyo Neon Hoodie',
    slug: 'tokyo-neon-hoodie',
    price: 89.99,
    category: 'fashion',
    culture: 'Tokyo',
    images: ['/product-1a.jpg', '/product-1b.jpg'],
    description: 'Inspired by the neon-lit streets of Shibuya',
    isFeatured: true
  },
  {
    name: 'NYC Underground Vinyl',
    slug: 'nyc-underground-vinyl',
    price: 29.99,
    category: 'music',
    culture: 'New York',
    images: ['/product-2a.jpg', '/product-2b.jpg'],
    description: 'Limited edition hip-hop vinyl straight from Brooklyn'
  },
  {
    name: 'Lagos Beats Headphones',
    slug: 'lagos-beats-headphones',
    price: 129.99,
    category: 'accessories',
    culture: 'Lagos',
    images: ['/product-3a.jpg', '/product-3b.jpg'],
    description: 'Experience Afrobeats like never before'
  },
  {
    name: 'Seoul Streetwear Jacket',
    slug: 'seoul-streetwear-jacket',
    price: 149.99,
    category: 'fashion',
    culture: 'Seoul',
    images: ['/product-4a.jpg', '/product-4b.jpg'],
    description: 'K-pop inspired fashion statement piece'
  },
  {
    name: 'Tokyo Techno Vinyl',
    slug: 'tokyo-techno-vinyl',
    price: 34.99,
    category: 'music',
    culture: 'Tokyo',
    images: ['/product-5a.jpg', '/product-5b.jpg'],
    description: 'Cutting-edge electronic music from Tokyo\'s underground scene'
  },
  {
    name: 'New York Cap',
    slug: 'new-york-cap',
    price: 39.99,
    category: 'accessories',
    culture: 'New York',
    images: ['/product-6a.jpg', '/product-6b.jpg'],
    description: 'Classic New York streetwear cap'
  },
  {
    name: 'Lagos Pattern Tee',
    slug: 'lagos-pattern-tee',
    price: 49.99,
    category: 'fashion',
    culture: 'Lagos',
    images: ['/product-7a.jpg', '/product-7b.jpg'],
    description: 'Vibrant t-shirt with traditional Nigerian patterns'
  },
  {
    name: 'Seoul K-Pop Album',
    slug: 'seoul-k-pop-album',
    price: 24.99,
    category: 'music',
    culture: 'Seoul',
    images: ['/product-8a.jpg', '/product-8b.jpg'],
    description: 'Limited edition K-Pop album with exclusive photobook'
  },
  {
    name: 'London Club Jacket',
    slug: 'london-club-jacket',
    price: 129.99,
    category: 'fashion',
    culture: 'London',
    images: ['/product-9a.jpg', '/product-9b.jpg'],
    description: 'Stylish jacket inspired by London\'s electronic music scene',
    isFeatured: true
  },
  {
    name: 'London Underground Beanie',
    slug: 'london-underground-beanie',
    price: 29.99,
    category: 'accessories',
    culture: 'London',
    images: ['/product-10a.jpg', '/product-10b.jpg'],
    description: 'Keep warm with this London Underground inspired beanie'
  },
  {
    name: 'London Beats Vinyl',
    slug: 'london-beats-vinyl',
    price: 39.99,
    category: 'music',
    culture: 'London',
    images: ['/product-11a.jpg', '/product-11b.jpg'],
    description: 'Limited edition drum and bass vinyl from London\'s top producers'
  }
];

// Sample user data
const userData = {
  name: 'Test User',
  email: 'test@example.com',
  password: 'password123' // In a real app, this would be hashed
};

// Function to import data
const importData = async () => {
  try {
    const conn = await connectDB();
    console.log('Connected to MongoDB, seeding data...');
    
    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});
    
    console.log('Existing data cleared');

    // Import products
    await Product.insertMany(productData);
    console.log(`${productData.length} products inserted`);
    
    // Create user
    await User.create(userData);
    console.log('Test user created');

    console.log('Data imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Function to destroy data
const destroyData = async () => {
  try {
    await connectDB();
    console.log('Connected to MongoDB, destroying data...');
    
    // Clear all data
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('Data destroyed successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Run the appropriate function based on command line args
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 