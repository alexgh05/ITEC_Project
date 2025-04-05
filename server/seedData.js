import mongoose from 'mongoose';
import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

// __dirname workaround for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load env variables
dotenv.config({ path: join(__dirname, '..', '.env') });

// Update MongoDB URI
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/culture-drop-shop';

// Connect to MongoDB
connectDB();

// Sample data
const users = [
  {
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'adminpass',
    role: 'admin'
  },
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
    role: 'user'
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
    role: 'user'
  }
];

const products = [
  {
    name: 'Tokyo Neon Hoodie',
    price: 89.99,
    category: 'fashion',
    culture: 'Tokyo',
    images: ['/products/tokyo-neon-hoodie-1.svg', '/products/tokyo-neon-hoodie-2.svg'],
    description: 'Inspired by the neon-lit streets of Shibuya, this hoodie features a unique blend of contemporary Japanese street fashion with cyberpunk aesthetics.',
    countInStock: 25,
    isFeatured: true
  },
  {
    name: 'NYC Underground Vinyl',
    price: 29.99,
    category: 'music',
    culture: 'New York',
    images: ['/products/nyc-underground-vinyl-1.svg', '/products/nyc-underground-vinyl-2.svg'],
    description: 'Limited edition hip-hop vinyl straight from Brooklyn featuring the hottest underground artists.',
    countInStock: 15
  },
  {
    name: 'Lagos Beats Headphones',
    price: 129.99,
    category: 'accessories',
    culture: 'Lagos',
    images: ['/products/lagos-beats-headphones-1.svg', '/products/lagos-beats-headphones-2.svg'],
    description: 'Experience Afrobeats like never before with these premium sound quality headphones inspired by Nigerian rhythms.',
    countInStock: 8,
    isFeatured: true
  },
  {
    name: 'Seoul Streetwear Jacket',
    price: 149.99,
    category: 'fashion',
    culture: 'Seoul',
    images: ['/products/seoul-streetwear-jacket-1.svg', '/products/seoul-streetwear-jacket-2.svg'],
    description: 'K-pop inspired fashion statement piece with modern Korean design elements and premium materials.',
    countInStock: 12
  },
  {
    name: 'NYC Graffiti Cap',
    price: 39.99,
    category: 'accessories',
    culture: 'New York',
    images: ['/products/nyc-graffiti-cap-1.svg', '/products/nyc-graffiti-cap-2.svg'],
    description: 'Classic New York streetwear cap featuring authentic graffiti designs from local artists.',
    countInStock: 0, // Out of stock
    isFeatured: false
  },
  {
    name: 'Rio Festival T-Shirt',
    price: 45.99,
    category: 'fashion',
    culture: 'Lagos',
    images: ['/products/rio-festival-tshirt-1.svg', '/products/rio-festival-tshirt-2.svg'],
    description: 'Vibrant festival t-shirt inspired by the colors and energy of carnival celebrations.',
    countInStock: 0, // Out of stock
    isFeatured: false
  },
  {
    name: 'London Fog Umbrella',
    price: 49.99,
    category: 'accessories',
    culture: 'London',
    images: ['/products/london-fog-umbrella-1.svg', '/products/london-fog-umbrella-2.svg'],
    description: 'Stylish and durable umbrella inspired by London\'s iconic weather, perfect for rainy days with a touch of British elegance.',
    countInStock: 0, // Out of stock
    isFeatured: false
  },
  {
    name: 'Tokyo Techno Limited Edition',
    price: 79.99,
    category: 'music',
    culture: 'Tokyo',
    images: ['/products/tokyo-neon-hoodie-1.svg', '/products/tokyo-neon-hoodie-2.svg'], // Reusing images as placeholder
    description: 'Exclusive techno compilation featuring the most innovative sounds from Tokyo\'s underground electronic scene.',
    countInStock: 3, // Low stock
    isFeatured: true
  },
  {
    name: 'Seoul Digital Art Print',
    price: 59.99,
    category: 'art',
    culture: 'Seoul',
    images: ['/products/seoul-streetwear-jacket-1.svg', '/products/seoul-streetwear-jacket-2.svg'], // Reusing images as placeholder
    description: 'Limited edition digital art print showcasing the fusion of traditional Korean aesthetics with futuristic cyberpunk elements.',
    countInStock: 5, // Low stock
    isFeatured: false
  },
  {
    name: 'Lagos Pattern Tote Bag',
    price: 34.99,
    category: 'accessories',
    culture: 'Lagos',
    images: ['/products/lagos-beats-headphones-1.svg', '/products/lagos-beats-headphones-2.svg'], // Reusing images as placeholder
    description: 'Durable and stylish tote bag featuring authentic Nigerian patterns, perfect for shopping or everyday use.',
    countInStock: 20,
    isFeatured: false
  }
];

// Import data to DB
const importData = async () => {
  try {
    // Clear existing data
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    
    // Insert users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers[0]._id;
    const regularUser1 = createdUsers[1]._id;
    const regularUser2 = createdUsers[2]._id;
    
    // Add products with a reference to admin
    const sampleProducts = products.map(product => {
      return { ...product, user: adminUser };
    });
    
    const createdProducts = await Product.insertMany(sampleProducts);
    
    // Create some orders
    const orders = [
      {
        user: regularUser1,
        orderItems: [
          {
            name: createdProducts[0].name,
            quantity: 2,
            image: createdProducts[0].images[0],
            price: createdProducts[0].price,
            product: createdProducts[0]._id
          },
          {
            name: createdProducts[2].name,
            quantity: 1,
            image: createdProducts[2].images[0],
            price: createdProducts[2].price,
            product: createdProducts[2]._id
          }
        ],
        shippingAddress: {
          address: '123 Main St',
          city: 'New York',
          postalCode: '10001',
          country: 'USA'
        },
        paymentMethod: 'PayPal',
        taxPrice: 31.00,
        shippingPrice: 10.00,
        totalPrice: 351.97,
        isPaid: true,
        paidAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
        isDelivered: true,
        deliveredAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        user: regularUser2,
        orderItems: [
          {
            name: createdProducts[3].name,
            quantity: 1,
            image: createdProducts[3].images[0],
            price: createdProducts[3].price,
            product: createdProducts[3]._id
          }
        ],
        shippingAddress: {
          address: '456 Oak St',
          city: 'Chicago',
          postalCode: '60007',
          country: 'USA'
        },
        paymentMethod: 'Credit Card',
        taxPrice: 15.00,
        shippingPrice: 5.00,
        totalPrice: 169.99,
        isPaid: true,
        paidAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
        isDelivered: false
      },
      {
        user: regularUser1,
        orderItems: [
          {
            name: createdProducts[1].name,
            quantity: 1,
            image: createdProducts[1].images[0],
            price: createdProducts[1].price,
            product: createdProducts[1]._id
          },
          {
            name: createdProducts[4].name,
            quantity: 1,
            image: createdProducts[4].images[0],
            price: createdProducts[4].price,
            product: createdProducts[4]._id
          }
        ],
        shippingAddress: {
          address: '789 Pine St',
          city: 'Los Angeles',
          postalCode: '90001',
          country: 'USA'
        },
        paymentMethod: 'PayPal',
        taxPrice: 6.50,
        shippingPrice: 5.00,
        totalPrice: 76.48,
        isPaid: false,
        isDelivered: false
      }
    ];
    
    await Order.insertMany(orders);
    
    console.log('Data imported!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Delete all data from DB
const destroyData = async () => {
  try {
    await Order.deleteMany();
    await Product.deleteMany();
    await User.deleteMany();
    
    console.log('Data destroyed!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

// Check command line arguments to determine action
if (process.argv[2] === '-d') {
  destroyData();
} else {
  importData();
} 