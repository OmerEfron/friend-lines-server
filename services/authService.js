const jwt = require('jsonwebtoken');
const User = require('../models/User');
const userValidator = require('./validators/userValidator');
const tokenService = require('./tokenService');
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
    
    // Generate tokens
    const accessToken = tokenService.generateAccessToken({
      uuid: user.uuid,
      username: user.username
    });
    
    const refreshToken = await tokenService.generateRefreshToken(user.uuid);
    
    logger.info('USER_AUTH', 'User login successful', {
      userId: user.uuid,
      username: user.username,
      ip: logger.getContext()?.ip
    });
    
    return {
      user: user.toSafeObject(),
      accessToken,
      refreshToken
    };
  },
  
  async refreshTokens(refreshToken) {
    try {
      const result = await tokenService.refreshAccessToken(refreshToken);
      
      logger.info('USER_AUTH', 'Tokens refreshed successfully', {
        userId: result.user.uuid
      });
      
      return result;
    } catch (error) {
      logger.warn('USER_AUTH', 'Token refresh failed', {
        error: error.message
      });
      throw error;
    }
  },
  
  async logout(refreshToken) {
    try {
      if (refreshToken) {
        await tokenService.revokeRefreshToken(refreshToken);
      }
      
      logger.info('USER_AUTH', 'User logout successful');
      return { success: true };
    } catch (error) {
      logger.error('USER_AUTH', 'Logout failed', {
        error: error.message
      });
      throw new Error('Logout failed');
    }
  },
  
  verifyToken(token) {
    return tokenService.verifyAccessToken(token);
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
