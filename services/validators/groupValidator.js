const groupValidator = {
  validateGroupCreation(groupData) {
    const { name } = groupData;
    
    if (!name || name.trim().length === 0) {
      throw new Error('Group name is required');
    }
    
    return true;
  },
  
  validateGroupInvitation(groupId, inviterId, invitedUserId) {
    if (!groupId || !inviterId || !invitedUserId) {
      throw new Error('Group ID, inviter ID, and invited user ID are required');
    }
    
    if (inviterId === invitedUserId) {
      throw new Error('Cannot invite yourself to a group');
    }
    
    return true;
  },
  
  validateGroupOperation(groupId, userId) {
    if (!groupId || !userId) {
      throw new Error('Group ID and user ID are required');
    }
    
    return true;
  }
};

module.exports = groupValidator;
