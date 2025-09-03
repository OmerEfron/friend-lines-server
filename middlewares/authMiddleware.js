const authService = require('../services/authService');

const authMiddleware = {
  authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Access token required' } 
      });
    }
    
    try {
      const decoded = authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.message === 'Access token expired') {
        return res.status(401).json({ 
          success: false, 
          error: { 
            message: 'Access token expired',
            code: 'TOKEN_EXPIRED'
          } 
        });
      }
      
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Invalid token' } 
      });
    }
  },

  // Optional middleware to handle token refresh automatically
  async authenticateWithRefresh(req, res, next) {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        error: { message: 'Access token required' } 
      });
    }
    
    try {
      const decoded = authService.verifyToken(token);
      req.user = decoded;
      next();
    } catch (error) {
      if (error.message === 'Access token expired') {
        // Try to refresh the token
        const refreshToken = req.cookies.refreshToken;
        
        if (!refreshToken) {
          return res.status(401).json({ 
            success: false, 
            error: { 
              message: 'Access token expired and no refresh token available',
              code: 'TOKEN_EXPIRED'
            } 
          });
        }
        
        try {
          const result = await authService.refreshTokens(refreshToken);
          
          // Set new refresh token cookie
          res.cookie('refreshToken', result.refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000
          });
          
          // Set new access token in response header
          res.set('X-New-Access-Token', result.accessToken);
          
          // Continue with the request using the new token
          req.user = { uuid: result.user.uuid, username: result.user.username };
          next();
        } catch (refreshError) {
          res.clearCookie('refreshToken');
          return res.status(401).json({ 
            success: false, 
            error: { 
              message: 'Session expired, please login again',
              code: 'SESSION_EXPIRED'
            } 
          });
        }
      } else {
        return res.status(403).json({ 
          success: false, 
          error: { message: 'Invalid token' } 
        });
      }
    }
  }
};

module.exports = authMiddleware;
