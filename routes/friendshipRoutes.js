const express = require('express');
const friendshipController = require('../controllers/friendshipController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All friendship routes require authentication
router.use(authMiddleware.authenticateToken);

// Friend requests
router.post('/request', friendshipController.sendFriendRequest);
router.post('/accept', friendshipController.acceptFriendRequest);

// Friend management
router.delete('/:friendId', friendshipController.deleteFriendship);
router.get('/list', friendshipController.getFriends);
router.get('/requests', friendshipController.getPendingRequests);

module.exports = router;
