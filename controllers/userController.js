const userService = require('../services/userService');

const userController = {
  async register(req, res, next) {
    try {
      const { username, fullName, email, password } = req.body;
      
      // Basic validation
      if (!username || !fullName || !email || !password) {
        return res.status(400).json({
          success: false,
          error: { message: 'All fields are required' }
        });
      }
      
      if (password.length < 6) {
        return res.status(400).json({
          success: false,
          error: { message: 'Password must be at least 6 characters' }
        });
      }
      
      const user = await userService.createUser({ username, fullName, email, password });
      
      res.status(201).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  },
  
  async getProfile(req, res, next) {
    try {
      const user = await userService.findUserByUuid(req.user.uuid);
      
      res.status(200).json({
        success: true,
        data: { user }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;
