const express = require('express');
const userController = require('../controllers/userController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Public routes
router.post('/register', userController.register);

// Protected routes
router.get('/profile', authMiddleware.authenticateToken, userController.getProfile);

module.exports = router;
