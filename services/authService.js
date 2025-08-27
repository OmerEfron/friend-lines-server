const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userValidator = require('./validators/userValidator');

const authService = {
  async login(credentials) {
    // Validate input data
    userValidator.validateLogin(credentials);
    
    const { username, password } = credentials;
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Validate password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { uuid: user.uuid, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
    return {
      user: user.toSafeObject(),
      token
    };
  },
  
  verifyToken(token) {
    try {
      return jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    } catch (error) {
      throw new Error('Invalid token');
    }
  },
  
  async getCurrentUser(uuid) {
    const user = await User.findOne({ uuid });
    if (!user) {
      throw new Error('User not found');
    }
    return user.toSafeObject();
  }
};

module.exports = authService;
