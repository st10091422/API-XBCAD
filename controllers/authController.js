const { auth, User, admin } = require('../config/firebase');
const jwt = require('jsonwebtoken');

// User Registration
exports.register = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide all required fields' });
  }

  try {
    await admin.auth().getUserByEmail(email);
    return res.status(400).json({ error: 'User already exists with this email' });
  } catch (error) {
    if (error.code !== 'auth/user-not-found') {
      console.error('Error checking if user exists:', error);
      return res.status(500).json({ error: 'Failed to check user existence' });
    }
  }

  try {
    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: username,
    });

    // Step 3: Store additional user information in Firestore
    await User.doc(userRecord.uid).set({
      username: username,
      email: email,
      balance: 100_000,
      role: 'user',
      createdAt: new Date(),
    });

    res.status(200).json({ message: 'User registration successful' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
};

// User Login
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  try {
    // Sign in the user
    const userCredential = await auth.signInWithEmailAndPassword(email, password);
    const user = userCredential.user;

    // Retrieve user data from Firestore
    const userDoc = await User.doc(user.uid).get();
    if (!userDoc.exists) {
      return res.status(404).json({ message: 'User not found in Firestore' });
    }
    const userData = userDoc.data();

    const payload = {
      uid: user.uid,
      email: user.email,
      role: userData.role,
    };

    // Sign a JWT with a 2-day expiration
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '2d' });

    res.status(200).json({
      message: 'User signed in successfully',
      id: user.uid,
      username: userData.username,
      email: user.email,
      role: userData.role,
      token: token,
      balance: userData.balance,
    });
  } catch (error) {
    return res.status(401).json({ message: 'Invalid credentials', error: error.message });
  }
};
