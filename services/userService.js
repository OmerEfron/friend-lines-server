const User = require('../models/User');
const userValidator = require('./validators/userValidator');
const { applyPagination } = require('./utils/paginationUtils');

const userService = {
  async createUser(userData) {
    // Validate input data
    userValidator.validateRegistration(userData);
    
    const { username, fullName, email, password } = userData;
    
    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [{ username }, { email }]
    });
    
    if (existingUser) {
      throw new Error('Username or email already exists');
    }
    
    // Create new user (password will be hashed by the model pre-save hook)
    const user = new User({
      username,
      fullName,
      email,
      password
    });
    
    await user.save();
    
    // Return user without password
    return user.toSafeObject();
  },
  
  async findUserByUsername(username) {
    const user = await User.findOne({ username });
    return user;
  },
  
  async findUserByUuid(uuid) {
    const user = await User.findOne({ uuid });
    if (user) {
      return user.toSafeObject();
    }
    return null;
  },
  
  async searchUsers(query, page = 1, limit = 20) {
    const searchTerm = query.toLowerCase().trim();
    
    const searchQuery = {
      $or: [
        { username: { $regex: searchTerm, $options: 'i' } },
        { fullName: { $regex: searchTerm, $options: 'i' } },
        { email: { $regex: searchTerm, $options: 'i' } }
      ]
    };
    
    const users = await User.find(searchQuery).select('-password');
    const total = await User.countDocuments(searchQuery);
    
    // Apply pagination
    const paginatedResults = applyPagination(users, page, limit);
    
    return {
      users: paginatedResults.items,
      pagination: {
        page,
        limit,
        total,
        totalPages: paginatedResults.pagination.totalPages
      }
    };
  },
  
  async validatePassword(user, password) {
    return user.comparePassword(password);
  }
};

module.exports = userService;
