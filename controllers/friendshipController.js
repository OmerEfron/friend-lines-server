const friendshipService = require('../services/friendshipService');
const userService = require('../services/userService');

const friendshipController = {
  async sendFriendRequest(req, res, next) {
    try {
      const { friendId: targetUserId } = req.body;
      const fromUserId = req.user.uuid;
      
      const result = await friendshipService.sendFriendRequest(fromUserId, targetUserId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async acceptFriendRequest(req, res, next) {
    try {
      // Accept both field names for better client compatibility
      const { fromUserId, friendId } = req.body;
      const userId = req.user.uuid;
      
      // Use fromUserId if provided, otherwise fall back to friendId
      const requesterId = fromUserId || friendId;
      
      if (!requesterId) {
        return res.status(400).json({
          success: false,
          error: {
            message: 'Missing required field: fromUserId or friendId',
            statusCode: 400
          }
        });
      }
      
      const result = await friendshipService.acceptFriendRequest(userId, requesterId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async deleteFriendship(req, res, next) {
    try {
      const { friendId } = req.params;
      const userId = req.user.uuid;
      
      const result = await friendshipService.deleteFriendship(userId, friendId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getFriends(req, res, next) {
    try {
      const userId = req.user.uuid;
      const friendIds = await friendshipService.getFriends(userId);
      
      // Get friend details
      const friends = [];
      for (const friendId of friendIds) {
        const friend = await userService.findUserByUuid(friendId);
        if (friend) {
          friends.push(friend);
        }
      }
      
      res.status(200).json({
        success: true,
        data: { friends }
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getPendingRequests(req, res, next) {
    try {
      const userId = req.user.uuid;
      const requestIds = await friendshipService.getPendingRequests(userId);
      
      // Get requester details
      const requests = [];
      for (const requestId of requestIds) {
        const requester = await userService.findUserByUuid(requestId);
        if (requester) {
          requests.push(requester);
        }
      }
      
      res.status(200).json({
        success: true,
        data: { requests }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = friendshipController;
