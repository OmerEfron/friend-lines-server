const newsflashService = require('../services/newsflashService');
const friendshipService = require('../services/friendshipService');
const groupService = require('../services/groupService');
const userService = require('../services/userService');

const newsflashController = {
  async createNewsflash(req, res, next) {
    try {
      const { content, targetType, targetId } = req.body;
      const authorId = req.user.uuid;
      
      const newsflash = await newsflashService.createNewsflash(
        authorId, 
        content, 
        targetType, 
        targetId
      );
      
      res.status(201).json({
        success: true,
        data: { newsflash }
      });
    } catch (error) {
      next(error);
    }
  },
  
  async deleteNewsflash(req, res, next) {
    try {
      const { newsflashId } = req.params;
      const userId = req.user.uuid;
      
      const result = await newsflashService.deleteNewsflash(newsflashId, userId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getMyNewsflashes(req, res, next) {
    try {
      const userId = req.user.uuid;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      // Get user's friends and groups
      const userFriends = await friendshipService.getFriends(userId);
      const userGroups = await groupService.getUserGroups(userId);
      const userGroupIds = userGroups.map(group => group.id);
      
      const result = await newsflashService.getNewsflashesForUser(
        userId, 
        userFriends, 
        userGroupIds,
        page,
        limit
      );
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getNewsflashesByAuthor(req, res, next) {
    try {
      const { authorId } = req.params;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      const result = await newsflashService.getNewsflashesByAuthor(authorId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getNewsflashesByGroup(req, res, next) {
    try {
      const { groupId } = req.params;
      const userId = req.user.uuid;
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 20;
      
      // Check if user is a member of the group
      const groupMembers = await groupService.getGroupMembers(groupId);
      if (!groupMembers.includes(userId)) {
        return res.status(403).json({
          success: false,
          error: { message: 'Access denied. Not a member of this group.' }
        });
      }
      
      const result = await newsflashService.getNewsflashesByGroup(groupId, page, limit);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = newsflashController;
