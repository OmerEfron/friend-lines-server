const notificationService = require('../services/notificationService');
const logger = require('../services/utils/logger');

const notificationController = {
  async registerDevice(req, res, next) {
    try {
      // Comprehensive debugging for FCM token registration
      console.log('=== FCM TOKEN REGISTRATION DEBUG ===');
      console.log('Request method:', req.method);
      console.log('Request URL:', req.url);
      console.log('Request headers:', JSON.stringify(req.headers, null, 2));
      console.log('Request body:', req.body);
      console.log('Request body type:', typeof req.body);
      console.log('Request body keys:', req.body ? Object.keys(req.body) : 'No body');
      console.log('Content-Type header:', req.get('Content-Type'));
      console.log('Content-Length header:', req.get('Content-Length'));
      console.log('User from auth middleware:', req.user);
      console.log('=====================================');
      
      const { deviceToken, platform } = req.body;
      const userId = req.user.uuid;

      // Log the extracted values
      console.log('=== EXTRACTED VALUES ===');
      console.log('Extracted deviceToken:', deviceToken);
      console.log('Extracted platform:', platform);
      console.log('Extracted userId:', userId);
      console.log('Device token length:', deviceToken ? deviceToken.length : 'undefined');
      console.log('========================');

      if (!deviceToken) {
        console.log('ERROR: Device token is missing from request body');
        return res.status(400).json({
          success: false,
          message: 'Device token is required',
          debug: {
            body: req.body,
            bodyType: typeof req.body,
            bodyKeys: req.body ? Object.keys(req.body) : [],
            contentType: req.get('Content-Type')
          }
        });
      }

      console.log('Calling notificationService.registerDeviceToken...');
      const result = await notificationService.registerDeviceToken(
        userId, 
        deviceToken, 
        platform || 'android'
      );

      console.log('=== REGISTRATION RESULT ===');
      console.log('Service result:', result);
      console.log('Saved FCM token ID:', result._id);
      console.log('Saved FCM token:', result.deviceToken);
      console.log('Saved platform:', result.platform);
      console.log('Saved userId:', result.userId);
      console.log('==========================');

      res.status(200).json({
        success: true,
        message: 'Device registered successfully',
        data: {
          id: result._id,
          platform: result.platform,
          tokenLength: result.deviceToken.length
        }
      });
    } catch (error) {
      console.log('=== ERROR IN REGISTRATION ===');
      console.log('Error:', error.message);
      console.log('Error stack:', error.stack);
      console.log('============================');
      next(error);
    }
  },

  async getNotificationHistory(req, res, next) {
    try {
      // For now, return empty array
      // You can implement notification history later
      res.status(200).json({
        success: true,
        data: {
          notifications: []
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = notificationController;
