const mongoose = require('mongoose');
require('dotenv').config();

// Import the models
const User = require('../models/User');
const Friendship = require('../models/Friendship');

const checkFriendRequests = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI environment variable is required');
      process.exit(1);
    }
    
    await mongoose.connect(mongoURI);
    console.log('Connected to MongoDB successfully');
    
    // Find the frienduser by username
    const friendUser = await User.findOne({ username: 'frienduser' });
    
    if (!friendUser) {
      console.log('frienduser not found in the system');
      return;
    }
    
    console.log(`\n=== FRIEND REQUESTS FOR: ${friendUser.username} ===`);
    console.log(`User ID: ${friendUser.uuid}`);
    console.log(`Full Name: ${friendUser.fullName}`);
    console.log(`Email: ${friendUser.email}`);
    
    // Check for pending friend requests (where frienduser is the recipient)
    const pendingRequests = await Friendship.find({
      user2Id: friendUser.uuid,
      status: 'pending'
    });
    
    console.log(`\n--- PENDING FRIEND REQUESTS (${pendingRequests.length}) ---`);
    
    if (pendingRequests.length === 0) {
      console.log('No pending friend requests found');
    } else {
      for (let i = 0; i < pendingRequests.length; i++) {
        const request = pendingRequests[i];
        const requester = await User.findOne({ uuid: request.user1Id });
        
        console.log(`\n${i + 1}. Request from:`);
        console.log(`   User ID: ${request.user1Id}`);
        console.log(`   Username: ${requester ? requester.username : 'Unknown'}`);
        console.log(`   Full Name: ${requester ? requester.fullName : 'Unknown'}`);
        console.log(`   Email: ${requester ? requester.email : 'Unknown'}`);
        console.log(`   Request sent: ${request.createdAt}`);
      }
    }
    
    // Check for sent friend requests (where frienduser is the sender)
    const sentRequests = await Friendship.find({
      user1Id: friendUser.uuid,
      status: 'pending'
    });
    
    console.log(`\n--- SENT FRIEND REQUESTS (${sentRequests.length}) ---`);
    
    if (sentRequests.length === 0) {
      console.log('No sent friend requests found');
    } else {
      for (let i = 0; i < sentRequests.length; i++) {
        const request = sentRequests[i];
        const recipient = await User.findOne({ uuid: request.user2Id });
        
        console.log(`\n${i + 1}. Request to:`);
        console.log(`   User ID: ${request.user2Id}`);
        console.log(`   Username: ${recipient ? recipient.username : 'Unknown'}`);
        console.log(`   Full Name: ${recipient ? recipient.fullName : 'Unknown'}`);
        console.log(`   Email: ${recipient ? recipient.email : 'Unknown'}`);
        console.log(`   Request sent: ${request.createdAt}`);
      }
    }
    
    // Check for accepted friendships
    const acceptedFriendships = await Friendship.find({
      $or: [{ user1Id: friendUser.uuid }, { user2Id: friendUser.uuid }],
      status: 'accepted'
    });
    
    console.log(`\n--- ACCEPTED FRIENDSHIPS (${acceptedFriendships.length}) ---`);
    
    if (acceptedFriendships.length === 0) {
      console.log('No accepted friendships found');
    } else {
      for (let i = 0; i < acceptedFriendships.length; i++) {
        const friendship = acceptedFriendships[i];
        const friendId = friendship.user1Id === friendUser.uuid ? friendship.user2Id : friendship.user1Id;
        const friend = await User.findOne({ uuid: friendId });
        
        console.log(`\n${i + 1}. Friend:`);
        console.log(`   User ID: ${friendId}`);
        console.log(`   Username: ${friend ? friend.username : 'Unknown'}`);
        console.log(`   Full Name: ${friend ? friend.fullName : 'Unknown'}`);
        console.log(`   Email: ${friend ? friend.email : 'Unknown'}`);
        console.log(`   Friendship accepted: ${friendship.updatedAt}`);
      }
    }
    
    console.log('\n===========================');
    
  } catch (error) {
    console.error('Error checking friend requests:', error.message);
  } finally {
    // Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
};

// Run the script
checkFriendRequests();
