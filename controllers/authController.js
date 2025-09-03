const authService = require('../services/authService');

const authController = {
  async login(req, res, next) {
    try {
      const { username, password } = req.body;
      
      const result = await authService.login({ username, password });
      
      // Set refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      next(error);
    }
  },

  async refresh(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      if (!refreshToken) {
        return res.status(401).json({
          success: false,
          error: { message: 'Refresh token required' }
        });
      }
      
      const result = await authService.refreshTokens(refreshToken);
      
      // Set new refresh token as HTTP-only cookie
      res.cookie('refreshToken', result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      });
      
      res.status(200).json({
        success: true,
        data: {
          user: result.user,
          accessToken: result.accessToken
        }
      });
    } catch (error) {
      // Clear invalid refresh token cookie
      res.clearCookie('refreshToken');
      next(error);
    }
  },

  async logout(req, res, next) {
    try {
      const refreshToken = req.cookies.refreshToken;
      
      await authService.logout(refreshToken);
      
      // Clear refresh token cookie
      res.clearCookie('refreshToken');
      
      res.status(200).json({
        success: true,
        message: 'Logged out successfully'
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;
