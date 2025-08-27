const notificationService = require('../services/notificationService');
const logger = require('../services/utils/logger');

const notificationController = {
  async registerDevice(req, res, next) {
    try {
      const { deviceToken, platform } = req.body;
      const userId = req.user.uuid;

      if (!deviceToken) {
        return res.status(400).json({
          success: false,
          message: 'Device token is required'
        });
      }

      const result = await notificationService.registerDeviceToken(
        userId, 
        deviceToken, 
        platform || 'android'
      );

      res.status(200).json({
        success: true,
        message: 'Device registered successfully',
        data: {
          id: result._id,
          platform: result.platform
        }
      });
    } catch (error) {
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
