const admin = require('../config/firebase');
const logger = require('./utils/logger');

const fcmService = {
  async sendNotification(deviceTokens, title, body, data = {}) {
    try {
      if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
        logger.warn('FCM', 'No device tokens provided for notification');
        return { success: 0, failure: 0 };
      }

      const message = {
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        },
        tokens: deviceTokens
      };

      const response = await admin.messaging().sendMulticast(message);
      
      logger.info('FCM', 'Notification sent successfully', {
        success: response.successCount,
        failure: response.failureCount,
        total: deviceTokens.length
      });

      return {
        success: response.successCount,
        failure: response.failureCount
      };
    } catch (error) {
      logger.error('FCM', 'Failed to send notification', {
        error: error.message,
        deviceTokensCount: deviceTokens.length
      });
      throw error;
    }
  },

  async sendToTopic(topic, title, body, data = {}) {
    try {
      const message = {
        notification: {
          title,
          body
        },
        data: {
          ...data,
          timestamp: new Date().toISOString()
        },
        topic
      };

      const response = await admin.messaging().send(message);
      
      logger.info('FCM', 'Topic notification sent successfully', {
        topic,
        messageId: response
      });

      return response;
    } catch (error) {
      logger.error('FCM', 'Failed to send topic notification', {
        error: error.message,
        topic
      });
      throw error;
    }
  }
};

module.exports = fcmService;
