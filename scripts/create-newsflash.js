const mongoose = require('mongoose');
require('dotenv').config();

// Import the models and services
const User = require('../models/User');
const Newsflash = require('../models/Newsflash');
const newsflashService = require('../services/newsflashService');

const createNewsflash = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI environment variable is required');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
    
    // Find the frienduser
    const friendUser = await User.findOne({ username: 'frienduser' });
    
    if (!friendUser) {
      console.log('frienduser not found in the system');
      return;
    }
    
    console.log(`\n=== CREATING NEWSFLASH FOR: ${friendUser.username} ===`);
    console.log(`User ID: ${friendUser.uuid}`);
    console.log(`Full Name: ${friendUser.fullName}`);
    console.log(`Email: ${friendUser.email}`);
    
    // Create a sample newsflash content
    const newsflashData = {
      authorId: friendUser.uuid,
      content: "Just accepted a friend request from Omer Test! Excited to connect! 🎉",
      targetType: 'friends' // This will be visible to all friends
    };
    
    console.log(`\n--- NEWSFLASH DETAILS ---`);
    console.log(`Content: "${newsflashData.content}"`);
    console.log(`Target Type: ${newsflashData.targetType}`);
    console.log(`Character Count: ${newsflashData.content.length}/100`);
    
    // Create the newsflash using the service
    const newsflash = await newsflashService.createNewsflash(newsflashData);
    
    if (newsflash) {
      console.log(`\n✅ Newsflash created successfully!`);
      console.log(`Newsflash ID: ${newsflash._id}`);
      console.log(`Author: ${friendUser.username}`);
      console.log(`Content: ${newsflash.content}`);
      console.log(`Target Type: ${newsflash.targetType}`);
      console.log(`Created: ${newsflash.createdAt}`);
      console.log(`Is Deleted: ${newsflash.isDeleted}`);
      
      // Verify the newsflash was saved in the database
      const savedNewsflash = await Newsflash.findById(newsflash._id);
      if (savedNewsflash) {
        console.log(`\nVerification: Newsflash confirmed in database`);
        console.log(`Database ID: ${savedNewsflash._id}`);
        console.log(`Status: Active`);
      }
    } else {
      console.log('Failed to create newsflash');
    }
    
    console.log('\n===========================');
    
  } catch (error) {
    console.error('Error creating newsflash:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
createNewsflash();
