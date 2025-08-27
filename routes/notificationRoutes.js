const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Register device token (mobile app calls this)
router.post('/register-device', authMiddleware.authenticateToken, notificationController.registerDevice);

// Get notification history (optional)
router.get('/history', authMiddleware.authenticateToken, notificationController.getNotificationHistory);

module.exports = router;
