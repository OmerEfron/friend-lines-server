const { v4: uuidv4 } = require('uuid');
const groupValidator = require('./validators/groupValidator');

// In-memory storage for groups and invitations
const groups = new Map(); // groupId -> group object
const groupInvitations = new Map(); // groupId -> Set of invited user UUIDs
const groupMembers = new Map(); // groupId -> Set of member UUIDs

const groupService = {
  async createGroup(creatorId, groupName, description = '') {
    // Validate input data
    groupValidator.validateGroupCreation({ name: groupName });
    
    const groupId = uuidv4();
    const group = {
      id: groupId,
      name: groupName.trim(),
      description: description.trim(),
      creatorId,
      createdAt: new Date().toISOString(),
      members: new Set([creatorId])
    };
    
    groups.set(groupId, group);
    groupMembers.set(groupId, new Set([creatorId]));
    
    return group;
  },
  
  async inviteToGroup(groupId, inviterId, invitedUserId) {
    // Validate input data
    groupValidator.validateGroupInvitation(groupId, inviterId, invitedUserId);
    
    if (!groups.has(groupId)) {
      throw new Error('Group not found');
    }
    
    const group = groups.get(groupId);
    if (!group.members.has(inviterId)) {
      throw new Error('Only group members can invite others');
    }
    
    if (group.members.has(invitedUserId)) {
      throw new Error('User is already a member of this group');
    }
    
    // Add to invitations
    if (!groupInvitations.has(groupId)) {
      groupInvitations.set(groupId, new Set());
    }
    groupInvitations.get(groupId).add(invitedUserId);
    
    return { success: true, message: 'Invitation sent' };
  },
  
  async acceptGroupInvitation(groupId, userId) {
    if (!groups.has(groupId)) {
      throw new Error('Group not found');
    }
    
    if (!groupInvitations.has(groupId) || !groupInvitations.get(groupId).has(userId)) {
      throw new Error('No invitation found for this group');
    }
    
    // Remove from invitations
    groupInvitations.get(groupId).delete(userId);
    
    // Add to members
    const group = groups.get(groupId);
    group.members.add(userId);
    
    if (!groupMembers.has(groupId)) {
      groupMembers.set(groupId, new Set());
    }
    groupMembers.get(groupId).add(userId);
    
    return { success: true, message: 'Joined group successfully' };
  },
  
  async leaveGroup(groupId, userId) {
    // Validate input data
    groupValidator.validateGroupOperation(groupId, userId);
    
    if (!groups.has(groupId)) {
      throw new Error('Group not found');
    }
    
    const group = groups.get(groupId);
    if (!group.members.has(userId)) {
      throw new Error('Not a member of this group');
    }
    
    if (group.creatorId === userId) {
      throw new Error('Group creator cannot leave. Delete the group instead.');
    }
    
    // Remove from members
    group.members.delete(userId);
    groupMembers.get(groupId).delete(userId);
    
    return { success: true, message: 'Left group successfully' };
  },
  
  async getGroupMembers(groupId) {
    if (!groups.has(groupId)) {
      throw new Error('Group not found');
    }
    return Array.from(groups.get(groupId).members);
  },
  
  async getUserGroups(userId) {
    const userGroups = [];
    for (const [groupId, group] of groups) {
      if (group.members.has(userId)) {
        userGroups.push({
          id: group.id,
          name: group.name,
          description: group.description,
          creatorId: group.creatorId,
          createdAt: group.createdAt
        });
      }
    }
    return userGroups;
  },
  
  async getPendingInvitations(userId) {
    const pendingInvitations = [];
    for (const [groupId, invitedUsers] of groupInvitations) {
      if (invitedUsers.has(userId)) {
        const group = groups.get(groupId);
        pendingInvitations.push({
          groupId,
          groupName: group.name,
          groupDescription: group.description
        });
      }
    }
    return pendingInvitations;
  }
};

module.exports = groupService;
