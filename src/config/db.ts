import mongoose from "mongoose";

async function connectDB() {
  const url = process.env.MONGO_URL || 'mongodb://localhost:27017/library';

  try {
    await mongoose.connect(url);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', (error instanceof Error ? error.message : String(error)));
    process.exit(1);
  }
}

export default connectDB;