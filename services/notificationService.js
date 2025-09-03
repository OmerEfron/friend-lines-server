const DeviceToken = require('../models/DeviceToken');
const User = require('../models/User');
const fcmService = require('./fcmService');
const friendshipService = require('./friendshipService');
const groupService = require('./groupService');
const logger = require('./utils/logger');

const notificationService = {
  async sendNewsflashNotification(newsflashContent, authorId, targetType, targetId) {
    try {
      // Get recipients based on target type
      let recipients = [];
      
      if (targetType === 'friends') {
        recipients = await this.getFriendsRecipients(authorId);
      } else if (targetType === 'group') {
        recipients = await this.getGroupRecipients(targetId);
      }

      if (recipients.length === 0) {
        logger.info('NOTIFICATION', 'No recipients found for newsflash notification');
        return;
      }

      // Get device tokens for recipients
      const deviceTokens = await this.getDeviceTokens(recipients);
      
      if (deviceTokens.length === 0) {
        logger.info('NOTIFICATION', 'No device tokens found for recipients');
        return;
      }

      // Get author's full name for the notification title
      const author = await User.findOne({ uuid: authorId });
      const notificationTitle = author ? author.fullName : 'New Newsflash';

      // Send notification with author's name as title
      const result = await fcmService.sendNotification(
        deviceTokens,
        notificationTitle,
        newsflashContent,
        {
          type: 'newsflash',
          authorId
        }
      );

      logger.info('NOTIFICATION', 'Newsflash notification sent', {
        recipients: recipients.length,
        deviceTokens: deviceTokens.length,
        success: result.success,
        failure: result.failure
      });

      return result;
    } catch (error) {
      logger.error('NOTIFICATION', 'Failed to send newsflash notification', {
        error: error.message,
        authorId,
        targetType,
        targetId
      });
      throw error;
    }
  },

  async getFriendsRecipients(authorId) {
    try {
      const friendIds = await friendshipService.getFriends(authorId);
      return friendIds; // getFriends already returns the user IDs
    } catch (error) {
      logger.error('NOTIFICATION', 'Failed to get friends recipients', {
        error: error.message,
        authorId
      });
      return [];
    }
  },

  async getGroupRecipients(groupId) {
    try {
      const members = await groupService.getGroupMembers(groupId);
      return members.map(member => member.uuid);
    } catch (error) {
      logger.error('NOTIFICATION', 'Failed to get group recipients', {
        error: error.message,
        groupId
      });
      return [];
    }
  },

  async getDeviceTokens(userIds) {
    try {
      const deviceTokens = await DeviceToken.find({
        userId: { $in: userIds },
        isActive: true
      });
      
      return deviceTokens.map(dt => dt.deviceToken);
    } catch (error) {
      logger.error('NOTIFICATION', 'Failed to get device tokens', {
        error: error.message,
        userIds
      });
      return [];
    }
  },

  async registerDeviceToken(userId, deviceToken, platform = 'android') {
    try {
      // Remove existing token if exists
      await DeviceToken.findOneAndDelete({ deviceToken });
      
      // Create new token
      const newToken = new DeviceToken({
        userId,
        deviceToken,
        platform
      });
      
      await newToken.save();
      
      logger.info('NOTIFICATION', 'Device token registered successfully', {
        userId,
        platform,
        tokenLength: deviceToken.length
      });
      
      return newToken;
    } catch (error) {
      logger.error('NOTIFICATION', 'Failed to register device token', {
        error: error.message,
        userId,
        platform
      });
      throw error;
    }
  }
};

module.exports = notificationService;
