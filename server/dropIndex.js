import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const dropSlugIndex = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/culture-drop-shop');
    console.log('MongoDB Connected');
    
    // Wait a moment to ensure connection is established
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const db = mongoose.connection.db;
    
    // Drop the slug index from products collection
    await db.collection('products').dropIndex('slug_1');
    
    console.log('Slug index dropped successfully!');
    mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    console.log('If the error is "index not found", that\'s okay - it means the index doesn\'t exist.');
    mongoose.connection.close();
    process.exit(1);
  }
};

dropSlugIndex(); 