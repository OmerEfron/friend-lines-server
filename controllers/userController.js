const userService = require('../services/userService');

const userController = {
  async register(req, res, next) {
    try {
      const { username, fullName, email, password } = req.body;

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
  },

  async searchUsers(req, res, next) {
    try {
      const { q, page, limit } = req.query;

      if (!q || q.trim().length === 0) {
        return res.status(400).json({
          success: false,
          error: { message: 'Search query is required' }
        });
      }

      const result = await userService.searchUsers(q, parseInt(page) || 1, parseInt(limit) || 20);

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      next(error);
    }
  },

  async getProfileByUuid(req, res, next) {
    try {
      const user = await userService.findUserByUuid(req.params.uuid);
      res.status(200).json({ success: true, data: { user } });
    } catch (error) {
      next(error);
    }
  }
};




module.exports = userController;
