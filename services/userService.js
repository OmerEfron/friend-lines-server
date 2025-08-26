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
  
  async validatePassword(user, password) {
    return bcrypt.compare(password, user.password);
  }
};

module.exports = userService;
