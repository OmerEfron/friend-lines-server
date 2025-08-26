const { v4: uuidv4 } = require('uuid');
const friendshipValidator = require('./validators/friendshipValidator');

// In-memory storage for friendships and requests
const friendships = new Map(); // uuid -> Set of friend UUIDs
const friendRequests = new Map(); // uuid -> Set of pending request UUIDs

const friendshipService = {
  async sendFriendRequest(fromUserId, toUserId) {
    // Validate input data
    friendshipValidator.validateFriendRequest(fromUserId, toUserId);
    
    // Check if already friends
    if (friendships.has(fromUserId) && friendships.get(fromUserId).has(toUserId)) {
      throw new Error('Already friends');
    }
    
    // Check if request already exists
    if (friendRequests.has(toUserId) && friendRequests.get(toUserId).has(fromUserId)) {
      throw new Error('Friend request already sent');
    }
    
    // Add to pending requests
    if (!friendRequests.has(toUserId)) {
      friendRequests.set(toUserId, new Set());
    }
    friendRequests.get(toUserId).add(fromUserId);
    
    return { success: true, message: 'Friend request sent' };
  },
  
  async acceptFriendRequest(userId, fromUserId) {
    if (!friendRequests.has(userId) || !friendRequests.get(userId).has(fromUserId)) {
      throw new Error('No friend request found');
    }
    
    // Remove from pending requests
    friendRequests.get(userId).delete(fromUserId);
    
    // Add to friendships for both users
    if (!friendships.has(userId)) {
      friendships.set(userId, new Set());
    }
    if (!friendships.has(fromUserId)) {
      friendships.set(fromUserId, new Set());
    }
    
    friendships.get(userId).add(fromUserId);
    friendships.get(fromUserId).add(userId);
    
    return { success: true, message: 'Friendship accepted' };
  },
  
  async deleteFriendship(userId, friendId) {
    // Validate input data
    friendshipValidator.validateFriendshipOperation(userId, friendId);
    
    if (!friendships.has(userId) || !friendships.get(userId).has(friendId)) {
      throw new Error('Friendship not found');
    }
    
    // Remove from both users' friendship lists
    friendships.get(userId).delete(friendId);
    friendships.get(friendId).delete(userId);
    
    return { success: true, message: 'Friendship deleted' };
  },
  
  async getFriends(userId) {
    if (!friendships.has(userId)) {
      return [];
    }
    return Array.from(friendships.get(userId));
  },
  
  async getPendingRequests(userId) {
    if (!friendRequests.has(userId)) {
      return [];
    }
    return Array.from(friendRequests.get(userId));
  }
};

module.exports = friendshipService;
