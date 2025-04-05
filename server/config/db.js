import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const connectDB = async () => {
  try {
    // Try to connect with the primary MongoDB URI
    console.log('Attempting to connect to MongoDB...');
    const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/culture-drop-shop', {
      serverSelectionTimeoutMS: 5000, // Timeout after 5s
    });
    
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return true;
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    console.log('Application can continue without MongoDB for frontend-only testing');
    return false;
  }
};

export default connectDB; 