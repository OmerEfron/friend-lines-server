const admin = require('../config/firebase');
const logger = require('./utils/logger');

const fcmService = {
  async sendNotification(deviceTokens, title, body, data = {}) {
    try {
      if (!Array.isArray(deviceTokens) || deviceTokens.length === 0) {
        logger.warn('FCM', 'No device tokens provided for notification');
        return { success: 0, failure: 0 };
      }

      // Debug Firebase Admin SDK
      console.log('=== FCM DEBUG ===');
      console.log('Admin object:', typeof admin);
      console.log('Admin.messaging:', typeof admin.messaging);
      console.log('Admin.messaging():', admin.messaging());
      console.log('Available methods:', Object.getOwnPropertyNames(Object.getPrototypeOf(admin.messaging())));
      console.log('================');

      let successCount = 0;
      let failureCount = 0;

      // Send to each token individually since sendMulticast might not be available
      for (const token of deviceTokens) {
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
            token: token
          };

          const response = await admin.messaging().send(message);
          console.log('FCM message sent successfully:', response);
          successCount++;
        } catch (error) {
          console.error('FCM message failed for token:', token, error.message);
          failureCount++;
        }
      }
      
      logger.info('FCM', 'Notification sent successfully', {
        success: successCount,
        failure: failureCount,
        total: deviceTokens.length
      });

      return {
        success: successCount,
        failure: failureCount
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
