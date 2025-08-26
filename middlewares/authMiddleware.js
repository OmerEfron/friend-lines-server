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
      return res.status(403).json({ 
        success: false, 
        error: { message: 'Invalid token' } 
      });
    }
  }
};

module.exports = authMiddleware;
