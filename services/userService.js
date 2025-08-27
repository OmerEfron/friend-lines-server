const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const userValidator = require('./validators/userValidator');

// In-memory database
const users = new Map();

const userService = {
  async createUser(userData) {
    // Validate input data
    userValidator.validateRegistration(userData);
    
    const { username, fullName, email, password } = userData;
    
    // Check if user already exists
    for (const user of users.values()) {
      if (user.username === username || user.email === email) {
        throw new Error('Username or email already exists');
      }
    }
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const user = {
      uuid: uuidv4(),
      username,
      fullName,
      email,
      password: hashedPassword,
      createdAt: new Date().toISOString()
    };
    
    users.set(user.uuid, user);
    
    // Return user without password
    const { password: _, ...userWithoutPassword } = user;
    return userWithoutPassword;
  },
  
  async findUserByUsername(username) {
    for (const user of users.values()) {
      if (user.username === username) {
        return user;
      }
    }
    return null;
  },
  
  async findUserByUuid(uuid) {
    const user = users.get(uuid);
    if (user) {
      const { password: _, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },
  
  async searchUsers(query, page = 1, limit = 20) {
    const searchResults = [];
    const searchTerm = query.toLowerCase().trim();
    
    for (const user of users.values()) {
      if (user.username.toLowerCase().includes(searchTerm) || 
          user.fullName.toLowerCase().includes(searchTerm) ||
          user.email.toLowerCase().includes(searchTerm)) {
        const { password: _, ...userWithoutPassword } = user;
        searchResults.push(userWithoutPassword);
      }
    }
    
    // Apply pagination
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedResults = searchResults.slice(startIndex, endIndex);
    
    return {
      users: paginatedResults,
      pagination: {
        page,
        limit,
        total: searchResults.length,
        totalPages: Math.ceil(searchResults.length / limit)
      }
    };
  },
  
  async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
};

module.exports = userService;
