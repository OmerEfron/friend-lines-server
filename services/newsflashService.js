const { v4: uuidv4 } = require('uuid');
const newsflashValidator = require('./validators/newsflashValidator');

// In-memory storage for newsflashes
const newsflashes = new Map(); // newsflashId -> newsflash object
const groupNewsflashes = new Map(); // groupId -> Set of newsflash IDs

const newsflashService = {
  async createNewsflash(authorId, content, targetType, targetId = null) {
    // Validate input data
    newsflashValidator.validateNewsflashCreation({ content, targetType, targetId });
    
    const newsflashId = uuidv4();
    const newsflash = {
      id: newsflashId,
      authorId,
      content: content.trim(),
      targetType, // 'friends' or 'group'
      targetId, // group ID if targetType is 'group', null if 'friends'
      createdAt: new Date().toISOString(),
      isDeleted: false
    };
    
    newsflashes.set(newsflashId, newsflash);
    
    // If it's for a specific group, add to group newsflashes
    if (targetType === 'group' && targetId) {
      if (!groupNewsflashes.has(targetId)) {
        groupNewsflashes.set(targetId, new Set());
      }
      groupNewsflashes.get(targetId).add(newsflashId);
    }
    
    return newsflash;
  },
  
  async deleteNewsflash(newsflashId, userId) {
    // Validate input data
    newsflashValidator.validateNewsflashOperation(newsflashId, userId);
    
    const newsflash = newsflashes.get(newsflashId);
    if (!newsflash) {
      throw new Error('Newsflash not found');
    }
    
    if (newsflash.authorId !== userId) {
      throw new Error('Only the author can delete a newsflash');
    }
    
    // Soft delete
    newsflash.isDeleted = true;
    
    // Remove from group newsflashes if it was in a group
    if (newsflash.targetType === 'group' && newsflash.targetId) {
      const groupNews = groupNewsflashes.get(newsflash.targetId);
      if (groupNews) {
        groupNews.delete(newsflashId);
      }
    }
    
    return { success: true, message: 'Newsflash deleted successfully' };
  },
  
  async getNewsflashesForUser(userId, userFriends, userGroups) {
    const userNewsflashes = [];
    
    // Get newsflashes for all friends (public to friends)
    for (const newsflash of newsflashes.values()) {
      if (newsflash.isDeleted) continue;
      
      if (newsflash.targetType === 'friends') {
        userNewsflashes.push(newsflash);
      }
    }
    
    // Get newsflashes from user's groups
    for (const groupId of userGroups) {
      const groupNews = groupNewsflashes.get(groupId);
      if (groupNews) {
        for (const newsflashId of groupNews) {
          const newsflash = newsflashes.get(newsflashId);
          if (newsflash && !newsflash.isDeleted) {
            userNewsflashes.push(newsflash);
          }
        }
      }
    }
    
    // Sort by creation date (newest first)
    return userNewsflashes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  async getNewsflashesByAuthor(authorId) {
    const authorNewsflashes = [];
    
    for (const newsflash of newsflashes.values()) {
      if (newsflash.authorId === authorId && !newsflash.isDeleted) {
        authorNewsflashes.push(newsflash);
      }
    }
    
    return authorNewsflashes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  },
  
  async getNewsflashesByGroup(groupId) {
    const groupNewsflashesList = [];
    const groupNews = groupNewsflashes.get(groupId);
    
    if (groupNews) {
      for (const newsflashId of groupNews) {
        const newsflash = newsflashes.get(newsflashId);
        if (newsflash && !newsflash.isDeleted) {
          groupNewsflashesList.push(newsflash);
        }
      }
    }
    
    return groupNewsflashesList.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }
};

module.exports = newsflashService;
