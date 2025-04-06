import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from './models/Product.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Create products with real image URLs
const createProducts = async () => {
  try {
    // Delete all existing products first
    await Product.deleteMany({});
    console.log('Deleted existing products');
    
    // Create sample products with proper image URLs
    const products = [
      {
        name: 'Tokyo Neon Hoodie',
        price: 89.99,
        category: 'fashion',
        culture: 'Tokyo',
        gender: 'unisex',
        productId: 'TNH001',
        images: [
          {
            data: 'https://picsum.photos/200/300',
            contentType: 'image/jpeg'
          },
          {
            data: 'https://picsum.photos/200/301',
            contentType: 'image/jpeg'
          }
        ],
        description: 'Inspired by the neon-lit streets of Shibuya',
        countInStock: 25,
        isFeatured: true
      },
      {
        name: 'London Music',
        price: 10.00,
        category: 'music',
        culture: 'London',
        gender: 'unisex',
        productId: 'LM002',
        images: [
          {
            data: 'https://picsum.photos/200/302',
            contentType: 'image/jpeg'
          },
          {
            data: 'https://picsum.photos/200/303',
            contentType: 'image/jpeg'
          }
        ],
        description: 'Classic London music collection',
        countInStock: 15
      },
      {
        name: 'Lagos Beats Headphones',
        price: 129.99,
        category: 'accessories',
        culture: 'Lagos',
        gender: 'unisex',
        productId: 'LBH003',
        images: [
          {
            data: 'https://picsum.photos/200/304',
            contentType: 'image/jpeg'
          },
          {
            data: 'https://picsum.photos/200/305',
            contentType: 'image/jpeg'
          }
        ],
        description: 'Experience Afrobeats like never before',
        countInStock: 10
      },
      {
        name: 'Seoul Streetwear Jacket',
        price: 149.99,
        category: 'fashion',
        culture: 'Seoul',
        gender: 'unisex',
        productId: 'SSJ004',
        images: [
          {
            data: 'https://picsum.photos/200/306',
            contentType: 'image/jpeg'
          },
          {
            data: 'https://picsum.photos/200/307',
            contentType: 'image/jpeg'
          }
        ],
        description: 'K-pop inspired fashion statement piece',
        countInStock: 8
      }
    ];
    
    const createdProducts = await Product.insertMany(products);
    console.log('Created products:', createdProducts.map(p => p.name));
    
    return { success: true, productsCreated: createdProducts.length };
  } catch (error) {
    console.error('Error creating products:', error);
    return { success: false, error: error.message };
  }
};

// Run the script
const main = async () => {
  try {
    await connectDB();
    const result = await createProducts();
    console.log('Result:', result);
    process.exit(0);
  } catch (error) {
    console.error('Error during execution:', error);
    process.exit(1);
  }
};

main(); 