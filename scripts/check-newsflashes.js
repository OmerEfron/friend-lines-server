const mongoose = require('mongoose');
require('dotenv').config();

// Import the models
const User = require('../models/User');
const Newsflash = require('../models/Newsflash');

const checkNewsflashes = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI environment variable is required');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
    
    // Get all newsflashes (excluding deleted ones)
    const allNewsflashes = await Newsflash.find({ isDeleted: false }).populate('author', 'username fullName');
    
    console.log(`\n=== ALL NEWSFLASHES IN THE SYSTEM ===`);
    console.log(`Total active newsflashes: ${allNewsflashes.length}`);
    
    if (allNewsflashes.length === 0) {
      console.log('No newsflashes found in the system');
    } else {
      allNewsflashes.forEach((newsflash, index) => {
        console.log(`\n${index + 1}. Newsflash ID: ${newsflash._id}`);
        console.log(`   Author: ${newsflash.author ? newsflash.author.username : 'Unknown'} (${newsflash.author ? newsflash.author.fullName : 'Unknown'})`);
        console.log(`   Content: "${newsflash.content}"`);
        console.log(`   Target Type: ${newsflash.targetType}`);
        console.log(`   Created: ${newsflash.createdAt}`);
        console.log(`   Updated: ${newsflash.updatedAt}`);
        console.log(`   Is Deleted: ${newsflash.isDeleted}`);
      });
    }
    
    // Get newsflashes specifically for friends
    const friendsNewsflashes = await Newsflash.find({ 
      targetType: 'friends', 
      isDeleted: false 
    }).populate('author', 'username fullName');
    
    console.log(`\n--- FRIENDS NEWSFLASHES (${friendsNewsflashes.length}) ---`);
    
    if (friendsNewsflashes.length > 0) {
      friendsNewsflashes.forEach((newsflash, index) => {
        console.log(`\n${index + 1}. Friends Newsflash:`);
        console.log(`   Author: ${newsflash.author ? newsflash.author.username : 'Unknown'}`);
        console.log(`   Content: "${newsflash.content}"`);
        console.log(`   Created: ${newsflash.createdAt}`);
      });
    }
    
    // Get newsflashes by frienduser specifically
    const friendUser = await User.findOne({ username: 'frienduser' });
    if (friendUser) {
      const frienduserNewsflashes = await Newsflash.find({ 
        authorId: friendUser.uuid, 
        isDeleted: false 
      });
      
      console.log(`\n--- NEWSFLASHES BY FRIENDUSER (${frienduserNewsflashes.length}) ---`);
      
      if (frienduserNewsflashes.length > 0) {
        frienduserNewsflashes.forEach((newsflash, index) => {
          console.log(`\n${index + 1}. Newsflash by frienduser:`);
          console.log(`   ID: ${newsflash._id}`);
          console.log(`   Content: "${newsflash.content}"`);
          console.log(`   Target Type: ${newsflash.targetType}`);
          console.log(`   Created: ${newsflash.createdAt}`);
        });
      }
    }
    
    console.log('\n===========================');
    
  } catch (error) {
    console.error('Error checking newsflashes:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
checkNewsflashes();
