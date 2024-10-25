// routes/userRoutes.js
const express = require('express');
const UserController = require('../controllers/userController');
const { userAuth } = require('../middleware/auth'); // User authentication middleware

const router = express.Router();
 
// User routes
router.get('/users/:userId', userAuth, UserController.getUser); // Get user by ID
router.put('/users/:userId', userAuth, UserController.updateUser); // Update user details

module.exports = router;
