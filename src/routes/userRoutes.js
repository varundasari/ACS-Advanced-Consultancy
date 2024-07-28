const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');

// Example route
router.get('/profile', userController.getProfile);

module.exports = router;
