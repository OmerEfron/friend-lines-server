const mongoose = require('mongoose');
const Group = require('../models/Group');
const GroupInvitation = require('../models/GroupInvitation');
const groupValidator = require('./validators/groupValidator');

const groupService = {
  async createGroup(groupData, creatorId) {
    // Validate input data
    groupValidator.validateGroupCreation(groupData);
    
    const { name, description = '' } = groupData;
    
    // Check if group name already exists for this creator
    const existingGroup = await Group.findOne({ name, creatorId });
    if (existingGroup) {
      throw new Error('Group with this name already exists');
    }
    
    // Create new group
    const group = new Group({
      name,
      description,
      creatorId,
      members: [creatorId] // Creator is automatically a member
    });
    
    await group.save();
    
    return group;
  },
  
  async inviteToGroup(groupId, inviterId, invitedUserId) {
    // Validate input data
    groupValidator.validateGroupInvitation(groupId, inviterId, invitedUserId);
    
    // Convert string ID to ObjectId
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
    // Check if group exists and inviter is a member
    const group = await Group.findOne({ _id: groupObjectId, members: inviterId });
    if (!group) {
      throw new Error('Group not found or you are not a member');
    }
    
    // Check if user is already a member
    if (group.members.includes(invitedUserId)) {
      throw new Error('User is already a member of this group');
    }
    
    // Check if invitation already exists
    const existingInvitation = await GroupInvitation.findOne({
      groupId,
      invitedUserId,
      status: 'pending'
    });
    
    if (existingInvitation) {
      throw new Error('Invitation already sent to this user');
    }
    
    // Create invitation
    const invitation = new GroupInvitation({
      groupId,
      invitedUserId,
      inviterId
    });
    
    await invitation.save();
    
    return { success: true, message: 'Invitation sent' };
  },
  
  async acceptGroupInvitation(groupId, userId) {
    // Convert string ID to ObjectId
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
    // Find the invitation
    const invitation = await GroupInvitation.findOne({
      groupId: groupObjectId,
      invitedUserId: userId,
      status: 'pending'
    });
    
    if (!invitation) {
      throw new Error('No invitation found');
    }
    
    // Accept invitation
    await invitation.accept();
    
    // Add user to group
    const group = await Group.findById(groupObjectId);
    if (group) {
      await group.addMember(userId);
    }
    
    return { success: true, message: 'Invitation accepted' };
  },
  
  async leaveGroup(groupId, userId) {
    // Validate input data
    groupValidator.validateGroupOperation(groupId, userId);
    
    // Convert string ID to ObjectId
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
    const group = await Group.findById(groupObjectId);
    if (!group) {
      throw new Error('Group not found');
    }
    
    if (group.creatorId === userId) {
      throw new Error('Group creator cannot leave the group');
    }
    
    if (!group.members.includes(userId)) {
      throw new Error('You are not a member of this group');
    }
    
    // Remove user from group
    await group.removeMember(userId);
    
    return { success: true, message: 'Left group successfully' };
  },
  
  async getGroupMembers(groupId) {
    // Convert string ID to ObjectId
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
    const group = await Group.findById(groupObjectId);
    if (!group) {
      throw new Error('Group not found');
    }
    
    // Get member details by UUID
    const memberDetails = [];
    for (const memberUuid of group.members) {
      const member = await require('../models/User').findOne({ uuid: memberUuid });
      if (member) {
        memberDetails.push(member.toSafeObject());
      }
    }
    
    return memberDetails;
  },
  
  async getUserGroups(userId) {
    const groups = await Group.findByUser(userId);
    return groups;
  },
  
  async getPendingInvitations(userId) {
    const invitations = await GroupInvitation.findPendingForUser(userId);
    return invitations;
  }
};

module.exports = groupService;
