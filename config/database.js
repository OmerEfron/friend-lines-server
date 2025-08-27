const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required. Please set it with your MongoDB Atlas connection string.');
    }
    
    await mongoose.connect(mongoURI);
    
    console.log('MongoDB Atlas connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
    console.log('\nTo fix this:');
    console.log('1. Set MONGODB_URI environment variable with your Atlas connection string');
    console.log('2. Make sure your IP is whitelisted in Atlas Network Access');
    console.log('3. Verify your database user credentials');
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    console.log('MongoDB disconnected successfully');
  } catch (error) {
    console.error('MongoDB disconnection error:', error.message);
  }
};

module.exports = { connectDB, disconnectDB };
