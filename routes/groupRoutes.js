const express = require('express');
const groupController = require('../controllers/groupController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All group routes require authentication
router.use(authMiddleware.authenticateToken);

// Group management
router.post('/create', groupController.createGroup);
router.post('/invite', groupController.inviteToGroup);
router.post('/join', groupController.acceptGroupInvitation);
router.delete('/:groupId/leave', groupController.leaveGroup);

// Group information
router.get('/:groupId/members', groupController.getGroupMembers);
router.get('/my-groups', groupController.getUserGroups);
router.get('/invitations', groupController.getPendingInvitations);

module.exports = router;
