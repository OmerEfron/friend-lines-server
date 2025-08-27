const mongoose = require('mongoose');
const logger = require('../services/utils/logger');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    
    if (!mongoURI) {
      throw new Error('MONGODB_URI environment variable is required. Please set it with your MongoDB Atlas connection string.');
    }
    
    await mongoose.connect(mongoURI);
    
    logger.info('SYSTEM', 'MongoDB Atlas connected successfully');
  } catch (error) {
    logger.error('SYSTEM', 'MongoDB connection failed', {
      error: error.message,
      action: 'database_connection'
    });
    
    logger.info('SYSTEM', 'Database connection troubleshooting steps', {
      steps: [
        'Set MONGODB_URI environment variable with your Atlas connection string',
        'Make sure your IP is whitelisted in Atlas Network Access',
        'Verify your database user credentials'
      ]
    });
    
    process.exit(1);
  }
};

const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    logger.info('SYSTEM', 'MongoDB disconnected successfully');
  } catch (error) {
    logger.error('SYSTEM', 'MongoDB disconnection failed', {
      error: error.message,
      action: 'database_disconnection'
    });
  }
};

module.exports = { connectDB, disconnectDB };
