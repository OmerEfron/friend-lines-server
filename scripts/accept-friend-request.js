const mongoose = require('mongoose');
require('dotenv').config();

// Import the models
const User = require('../models/User');
const Friendship = require('../models/Friendship');

const acceptFriendRequest = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI environment variable is required');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
    
    // Find the users
    const friendUser = await User.findOne({ username: 'frienduser' });
    const omerTest = await User.findOne({ username: 'Omer Test' });
    
    if (!friendUser) {
      console.log('frienduser not found in the system');
      return;
    }
    
    if (!omerTest) {
      console.log('Omer Test user not found in the system');
      return;
    }
    
    console.log(`\n=== ACCEPTING FRIEND REQUEST ===`);
    console.log(`From: ${omerTest.username} (${omerTest.fullName})`);
    console.log(`To: ${friendUser.username} (${friendUser.fullName})`);
    
    // Find the pending friend request
    const pendingRequest = await Friendship.findOne({
      user1Id: omerTest.uuid,
      user2Id: friendUser.uuid,
      status: 'pending'
    });
    
    if (!pendingRequest) {
      console.log('No pending friend request found from Omer Test to frienduser');
      return;
    }
    
    console.log(`\nFound pending request:`);
    console.log(`Request ID: ${pendingRequest._id}`);
    console.log(`Status: ${pendingRequest.status}`);
    console.log(`Created: ${pendingRequest.createdAt}`);
    
    // Accept the friend request by updating status to 'accepted'
    const updatedFriendship = await Friendship.findByIdAndUpdate(
      pendingRequest._id,
      { status: 'accepted' },
      { new: true }
    );
    
    if (updatedFriendship) {
      console.log(`\n✅ Friend request accepted successfully!`);
      console.log(`New status: ${updatedFriendship.status}`);
      console.log(`Updated at: ${updatedFriendship.updatedAt}`);
      
      // Verify the friendship is now accepted
      const acceptedFriendship = await Friendship.findOne({
        user1Id: omerTest.uuid,
        user2Id: friendUser.uuid,
        status: 'accepted'
      });
      
      if (acceptedFriendship) {
        console.log(`\nVerification: Friendship confirmed between:`);
        console.log(`- ${omerTest.username} (${omerTest.fullName})`);
        console.log(`- ${friendUser.username} (${friendUser.fullName})`);
      }
    } else {
      console.log('Failed to update friendship status');
    }
    
    console.log('\n===========================');
    
  } catch (error) {
    console.error('Error accepting friend request:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
acceptFriendRequest();
