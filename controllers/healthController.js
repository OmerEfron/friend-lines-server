const healthService = require('../services/healthService');

const healthController = {
  async getHealth(req, res, next) {
    try {
      const healthStatus = await healthService.getHealthStatus();
      res.status(200).json(healthStatus);
    } catch (error) {
      next(error);
    }
  }
};

module.exports = healthController;
