// controllers/userController.js
const UserModel = require('../models/user');

const UserController = {
  // Get user by ID
  async getUser(req, res) {
    try {
      const userId = req.params.userId;
      const user = await UserModel.getUserById(userId);
      if (!user) return res.status(404).json({ error: 'User not found' });
      return res.status(200).json(user);
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Create user (on registration)
  async createUser(req, res) {
    try {
      const userData = req.body;
      const newUser = await UserModel.createUser(userData);
      return res.status(201).json({ message: 'User created successfully', user: newUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  },

  // Update user details
  async updateUser(req, res) {
    try {
      const userId = req.params.userId;
      const updatedData = req.body;
      const updatedUser = await UserModel.updateUser(userId, updatedData);
      return res.status(200).json({ message: 'User updated successfully', user: updatedUser });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  }
};

module.exports = UserController;
