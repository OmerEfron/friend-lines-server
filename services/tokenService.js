const jwt = require('jsonwebtoken');
const RefreshToken = require('../models/RefreshToken');
const User = require('../models/User');
const logger = require('./utils/logger');

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
const ACCESS_TOKEN_EXPIRY = '15m'; // 15 minutes
const REFRESH_TOKEN_EXPIRY = '7d'; // 7 days

const tokenService = {
  // Generate access token (short-lived)
  generateAccessToken(payload) {
    return jwt.sign(payload, JWT_SECRET, { 
      expiresIn: ACCESS_TOKEN_EXPIRY 
    });
  },

  // Generate refresh token (long-lived, stored in DB)
  async generateRefreshToken(userId) {
    try {
      // Revoke all existing tokens for this user (token rotation)
      await RefreshToken.revokeAllForUser(userId);
      
      // Create new refresh token
      const refreshTokenDoc = await RefreshToken.createToken(userId);
      
      logger.info('TOKEN_SERVICE', 'Refresh token generated', {
        userId,
        tokenId: refreshTokenDoc._id
      });
      
      return refreshTokenDoc.token;
    } catch (error) {
      logger.error('TOKEN_SERVICE', 'Failed to generate refresh token', {
        userId,
        error: error.message
      });
      throw new Error('Failed to generate refresh token');
    }
  },

  // Verify access token
  verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === 'TokenExpiredError') {
        throw new Error('Access token expired');
      }
      throw new Error('Invalid access token');
    }
  },

  // Verify refresh token
  async verifyRefreshToken(token) {
    try {
      const refreshTokenDoc = await RefreshToken.findValidToken(token);
      
      if (!refreshTokenDoc) {
        throw new Error('Invalid or expired refresh token');
      }
      
      return refreshTokenDoc;
    } catch (error) {
      logger.warn('TOKEN_SERVICE', 'Invalid refresh token attempt', {
        error: error.message
      });
      throw new Error('Invalid or expired refresh token');
    }
  },

  // Refresh access token using refresh token
  async refreshAccessToken(refreshToken) {
    try {
      const refreshTokenDoc = await this.verifyRefreshToken(refreshToken);
      
      // Get user info for token payload
      const user = await User.findOne({ uuid: refreshTokenDoc.userId });
      if (!user) {
        throw new Error('User not found');
      }
      
      // Generate new access token
      const newAccessToken = this.generateAccessToken({
        uuid: user.uuid,
        username: user.username
      });
      
      // Revoke the used refresh token (token rotation)
      refreshTokenDoc.isRevoked = true;
      await refreshTokenDoc.save();
      
      // Generate new refresh token
      const newRefreshToken = await this.generateRefreshToken(refreshTokenDoc.userId);
      
      logger.info('TOKEN_SERVICE', 'Tokens refreshed successfully', {
        userId: refreshTokenDoc.userId
      });
      
      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        user: user.toSafeObject()
      };
    } catch (error) {
      logger.error('TOKEN_SERVICE', 'Failed to refresh tokens', {
        error: error.message
      });
      throw error;
    }
  },

  // Revoke refresh token (for logout)
  async revokeRefreshToken(token) {
    try {
      const refreshTokenDoc = await RefreshToken.findOne({ token });
      
      if (refreshTokenDoc) {
        refreshTokenDoc.isRevoked = true;
        await refreshTokenDoc.save();
        
        logger.info('TOKEN_SERVICE', 'Refresh token revoked', {
          userId: refreshTokenDoc.userId
        });
      }
    } catch (error) {
      logger.error('TOKEN_SERVICE', 'Failed to revoke refresh token', {
        error: error.message
      });
      throw new Error('Failed to revoke refresh token');
    }
  },

  // Revoke all tokens for a user
  async revokeAllUserTokens(userId) {
    try {
      await RefreshToken.revokeAllForUser(userId);
      
      logger.info('TOKEN_SERVICE', 'All tokens revoked for user', {
        userId
      });
    } catch (error) {
      logger.error('TOKEN_SERVICE', 'Failed to revoke all user tokens', {
        userId,
        error: error.message
      });
      throw new Error('Failed to revoke user tokens');
    }
  }
};

module.exports = tokenService;
