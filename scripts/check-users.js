const mongoose = require('mongoose');
require('dotenv').config();

// Import the User model
const User = require('../models/User');

const checkUsers = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI environment variable is required');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
    
    // Query all users (excluding password field for security)
    const users = await User.find({}).select('-password');
    
    console.log('\n=== USERS IN THE SYSTEM ===');
    console.log(`Total users found: ${users.length}`);
    
    if (users.length === 0) {
      console.log('No users found in the system');
    } else {
      users.forEach((user, index) => {
        console.log(`\n${index + 1}. User ID: ${user.uuid}`);
        console.log(`   Username: ${user.username}`);
        console.log(`   Full Name: ${user.fullName}`);
        console.log(`   Email: ${user.email}`);
        console.log(`   Created: ${user.createdAt}`);
        console.log(`   Last Updated: ${user.updatedAt}`);
      });
    }
    
    console.log('\n===========================');
    
  } catch (error) {
    console.error('Error checking users:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
checkUsers();
