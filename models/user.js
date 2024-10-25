const { User } = require('../config/firebase');

const UserModel = {
  // Get user by ID
  async getUserById(userId) {
    const userSnapshot = await User.doc(userId).get();

    if (!userSnapshot.exists) return null;
    return userSnapshot.data();
  },

  // Create new user
  async createUser(userData) {
    const newUser = {
      ...userData,
      createdAt: new Date(),
    };

    await User.doc(userData.uid).set(newUser);
    return newUser;
  },

  // Update user details
  async updateUser(userId, updatedData) {
    const userRef = User.doc(userId);
    await userRef.update(updatedData);
    return { userId, ...updatedData };
  }
};

module.exports = UserModel;
