const authService = require('../services/authService');

const authController = {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      // Basic validation
      if (!username || !password) {
        return res.status(400).json({
          success: false,
          error: { message: 'Username and password are required' }
        });
      }
      
      const result = await authService.login(username, password);
      
      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
