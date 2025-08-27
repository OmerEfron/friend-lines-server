const mongoose = require('mongoose');
const Newsflash = require('../models/Newsflash');
const newsflashValidator = require('./validators/newsflashValidator');
const { applyPagination } = require('./utils/paginationUtils');

const newsflashService = {
  async createNewsflash(newsflashData) {
    // Validate input data
    newsflashValidator.validateNewsflashCreation(newsflashData);
    
    const { authorId, content, targetType, targetId } = newsflashData;
    
    // Create new newsflash
    const newsflash = new Newsflash({
      authorId,
      content,
      targetType,
      targetId
    });
    
    await newsflash.save();
    
    return newsflash;
  },
  
  async deleteNewsflash(newsflashId, userId) {
    // Validate input data
    newsflashValidator.validateNewsflashOperation(newsflashId, userId);
    
    // Find the newsflash
    const newsflash = await Newsflash.findById(newsflashId);
    if (!newsflash) {
      throw new Error('Newsflash not found');
    }
    
    // Check if user is the author
    if (newsflash.authorId !== userId) {
      throw new Error('Only the author can delete this newsflash');
    }
    
    // Soft delete
    await newsflash.softDelete();
    
    return { success: true, message: 'Newsflash deleted successfully' };
  },
  
  async getNewsflashesForUser(userId, page = 1, limit = 20) {
    // Validate pagination
    newsflashValidator.validatePagination(page, limit);
    
    // Get newsflashes for friends (public to friends)
    const friendsNewsflashes = await Newsflash.findForFriends();
    
    // Apply pagination
    const paginatedResults = applyPagination(friendsNewsflashes, page, limit);
    
    return {
      newsflashes: paginatedResults.items,
      pagination: {
        page,
        limit,
        total: paginatedResults.pagination.total,
        totalPages: paginatedResults.pagination.totalPages
      }
    };
  },
  
  async getNewsflashesByAuthor(authorId, page = 1, limit = 20) {
    // Validate pagination
    newsflashValidator.validatePagination(page, limit);
    
    // Get newsflashes by author
    const newsflashes = await Newsflash.findByAuthor(authorId);
    
    // Apply pagination
    const paginatedResults = applyPagination(newsflashes, page, limit);
    
    return {
      newsflashes: paginatedResults.items,
      pagination: {
        page,
        limit,
        total: paginatedResults.pagination.total,
        totalPages: paginatedResults.pagination.totalPages
      }
    };
  },
  
  async getNewsflashesByGroup(groupId, page = 1, limit = 20) {
    // Validate pagination
    newsflashValidator.validatePagination(page, limit);
    
    // Convert string ID to ObjectId
    const groupObjectId = new mongoose.Types.ObjectId(groupId);
    
    // Get newsflashes for a specific group
    const newsflashes = await Newsflash.findForGroup(groupObjectId);
    
    // Apply pagination
    const paginatedResults = applyPagination(newsflashes, page, limit);
    
    return {
      newsflashes: paginatedResults.items,
      pagination: {
        page,
        limit,
        total: paginatedResults.pagination.total,
        totalPages: paginatedResults.pagination.totalPages
      }
    };
  }
};

module.exports = newsflashService;
