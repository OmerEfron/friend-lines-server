const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const authMiddleware = require('../middlewares/authMiddleware');

// Test route to check if body parsing works
router.post('/test', (req, res) => {
  console.log('=== TEST ROUTE DEBUG ===');
  console.log('Body at test route:', req.body);
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('========================');
  res.json({ 
    success: true, 
    body: req.body,
    bodyType: typeof req.body,
    bodyKeys: req.body ? Object.keys(req.body) : []
  });
});

// Register device token (mobile app calls this)
router.post('/register', authMiddleware.authenticateToken, (req, res, next) => {
  console.log('=== ROUTE LEVEL DEBUG ===');
  console.log('Body at route level:', req.body);
  console.log('Body type:', typeof req.body);
  console.log('Body keys:', req.body ? Object.keys(req.body) : 'No body');
  console.log('Content-Type:', req.get('Content-Type'));
  console.log('========================');
  next();
}, notificationController.registerDevice);

// Get notification history (optional)
router.get('/history', authMiddleware.authenticateToken, notificationController.getNotificationHistory);

module.exports = router;
