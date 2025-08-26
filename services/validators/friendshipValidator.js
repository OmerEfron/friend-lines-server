const friendshipValidator = {
  validateFriendRequest(fromUserId, toUserId) {
    if (!fromUserId || !toUserId) {
      throw new Error('Both user IDs are required');
    }
    
    if (fromUserId === toUserId) {
      throw new Error('Cannot send friend request to yourself');
    }
    
    return true;
  },
  
  validateFriendshipOperation(userId, friendId) {
    if (!userId || !friendId) {
      throw new Error('Both user IDs are required');
    }
    
    if (userId === friendId) {
      throw new Error('Invalid operation on yourself');
    }
    
    return true;
  }
};

module.exports = friendshipValidator;
