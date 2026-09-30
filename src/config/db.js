const mongoose = require('mongoose');

async function connectDB() {
  const url = process.env.MONGO_URL || 'mongodb://localhost:27017/library';

  try {
    await mongoose.connect(url);
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    process.exit(1);
  }
}

module.exports = connectDB;