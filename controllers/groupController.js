const groupService = require('../services/groupService');

const groupController = {
  async createGroup(req, res, next) {
    try {
      const { name, description } = req.body;
      const creatorId = req.user.uuid;
      
      const group = await groupService.createGroup({ name, description }, creatorId);
      
      res.status(201).json({
        success: true,
        data: { group }
      });
    } catch (error) {
      next(error);
    }
  },
  
  async inviteToGroup(req, res, next) {
    try {
      const { groupId, invitedUserId } = req.body;
      const inviterId = req.user.uuid;
      
      const result = await groupService.inviteToGroup(groupId, inviterId, invitedUserId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async acceptGroupInvitation(req, res, next) {
    try {
      const { groupId } = req.body;
      const userId = req.user.uuid;
      
      const result = await groupService.acceptGroupInvitation(groupId, userId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async leaveGroup(req, res, next) {
    try {
      const { groupId } = req.params;
      const userId = req.user.uuid;
      
      const result = await groupService.leaveGroup(groupId, userId);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getGroupMembers(req, res, next) {
    try {
      const { groupId } = req.params;
      const memberIds = await groupService.getGroupMembers(groupId);
      
      res.status(200).json({
        success: true,
        data: { members: memberIds }
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getUserGroups(req, res, next) {
    try {
      const userId = req.user.uuid;
      const groups = await groupService.getUserGroups(userId);
      
      res.status(200).json({
        success: true,
        data: { groups }
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getPendingInvitations(req, res, next) {
    try {
      const userId = req.user.uuid;
      const invitations = await groupService.getPendingInvitations(userId);
      
      res.status(200).json({
        success: true,
        data: { invitations }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = groupController;
