const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/login', authController.login);
router.post('/refresh', authController.refresh);
router.post('/logout', authController.logout);

// Protected route example
router.get('/me', authMiddleware.authenticateToken, async (req, res) => {
  try {
    const authService = require('../services/authService');
    const user = await authService.getCurrentUser(req.user.uuid);
    
    res.status(200).json({
      success: true,
      data: { user }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: { message: 'Failed to get user data' }
    });
  }
});

module.exports = router;
