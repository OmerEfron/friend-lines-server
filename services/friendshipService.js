const Friendship = require('../models/Friendship');
const friendshipValidator = require('./validators/friendshipValidator');

const friendshipService = {
  async sendFriendRequest(fromUserId, toUserId) {
    // Validate input data
    friendshipValidator.validateFriendRequest(fromUserId, toUserId);
    
    // Check if already friends
    const existingFriendship = await Friendship.areFriends(fromUserId, toUserId);
    if (existingFriendship) {
      throw new Error('Already friends');
    }
    
    // Check if request already exists
    const existingRequest = await Friendship.findOne({
      $or: [
        { user1Id: fromUserId, user2Id: toUserId, status: 'pending' },
        { user1Id: toUserId, user2Id: fromUserId, status: 'pending' }
      ]
    });
    
    if (existingRequest) {
      throw new Error('Friend request already sent');
    }
    
    // Create new friend request
    const friendship = new Friendship({
      user1Id: fromUserId,
      user2Id: toUserId,
      status: 'pending'
    });
    
    await friendship.save();
    
    return { success: true, message: 'Friend request sent' };
  },
  
  async acceptFriendRequest(userId, fromUserId) {
    // Find the pending request
    const friendship = await Friendship.findOne({
      user2Id: userId,
      user1Id: fromUserId,
      status: 'pending'
    });
    
    if (!friendship) {
      throw new Error('No friend request found');
    }
    
    // Update status to accepted
    friendship.status = 'accepted';
    await friendship.save();
    
    return { success: true, message: 'Friendship accepted' };
  },
  
  async deleteFriendship(userId, friendId) {
    // Validate input data
    friendshipValidator.validateFriendshipOperation(userId, friendId);
    
    // Find and delete the friendship
    const friendship = await Friendship.findOneAndDelete({
      $or: [
        { user1Id: userId, user2Id: friendId, status: 'accepted' },
        { user1Id: friendId, user2Id: userId, status: 'accepted' }
      ]
    });
    
    if (!friendship) {
      throw new Error('Friendship not found');
    }
    
    return { success: true, message: 'Friendship deleted' };
  },
  
  async getFriends(userId) {
    const friendships = await Friendship.findFriends(userId);
    return friendships.map(friendship => 
      friendship.user1Id === userId ? friendship.user2Id : friendship.user1Id
    );
  },
  
  async getPendingRequests(userId) {
    const requests = await Friendship.findPendingRequests(userId);
    return requests.map(request => request.user1Id);
  }
};

module.exports = friendshipService;
