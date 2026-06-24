import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    if (!process.env.MONGO_URI) {
      console.warn('MONGO_URI is not set. MongoDB features will not work.');
      return;
    }

    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    console.warn(`MongoDB connection warning: ${error.message}`);
    console.warn('Server will continue without database connection.');
  }
};

export default connectDB;
