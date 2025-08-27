const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userValidator = require('./validators/userValidator');
const logger = require('./utils/logger');

const authService = {
  async login(credentials) {
    // Validate input data
    userValidator.validateLogin(credentials);
    
    const { username, password } = credentials;
    
    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      logger.warn('USER_AUTH', 'Login failed - user not found', {
        username,
        ip: logger.getContext()?.ip,
        reason: 'user_not_found'
      });
      throw new Error('Invalid credentials');
    }
    
    // Validate password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      logger.warn('USER_AUTH', 'Login failed - invalid password', {
        username,
        userId: user.uuid,
        ip: logger.getContext()?.ip,
        reason: 'invalid_password'
      });
      throw new Error('Invalid credentials');
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { uuid: user.uuid, username: user.username },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );
    
        logger.info('USER_AUTH', 'User login successful', {
      userId: user.uuid,
        username: user.username,
        ip: logger.getContext()?.ip
      });
    
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
