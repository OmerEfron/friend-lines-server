const newsflashValidator = {
  validateNewsflashCreation(newsflashData) {
    const { content, targetType, targetId } = newsflashData;
    const errors = [];
    
    if (!content || content.trim().length === 0) {
      errors.push('Content is required');
    }
    
    if (content && content.trim().length > 100) {
      errors.push('Content must be less than 100 characters');
    }
    
    if (!targetType || !['friends', 'group'].includes(targetType)) {
      errors.push('Target type must be either "friends" or "group"');
    }
    
    if (targetType === 'group' && !targetId) {
      errors.push('Group ID is required when target type is "group"');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    return true;
  },
  
  validateNewsflashOperation(newsflashId, userId) {
    if (!newsflashId) {
      throw new Error('Newsflash ID is required');
    }
    
    if (!userId) {
      throw new Error('User ID is required');
    }
    
    return true;
  },
  
  validatePagination(page, limit) {
    const errors = [];
    
    if (page && (isNaN(page) || page < 1)) {
      errors.push('Page must be a positive number');
    }
    
    if (limit && (isNaN(limit) || limit < 1 || limit > 100)) {
      errors.push('Limit must be between 1 and 100');
    }
    
    if (errors.length > 0) {
      throw new Error(errors.join(', '));
    }
    
    return true;
  }
};

module.exports = newsflashValidator;
