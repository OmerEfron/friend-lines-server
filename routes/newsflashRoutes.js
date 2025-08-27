const express = require('express');
const newsflashController = require('../controllers/newsflashController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// All newsflash routes require authentication
router.use(authMiddleware.authenticateToken);

// Newsflash management
router.post('/create', newsflashController.createNewsflash);
router.delete('/:newsflashId', newsflashController.deleteNewsflash);

// Newsflash retrieval
router.get('/my-feed', newsflashController.getMyNewsflashes);
router.get('/author/:authorId', newsflashController.getNewsflashesByAuthor);
router.get('/group/:groupId', newsflashController.getNewsflashesByGroup);

module.exports = router;
