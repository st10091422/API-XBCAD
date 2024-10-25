const jwt = require('jsonwebtoken'); // Ensure you have jwt installed

// Middleware for user authentication
const userAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      // Add the decoded user info to the request object
      req.user = decoded;
      next();
    });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

// Middleware for admin authentication
const adminAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  try {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

      // Add the decoded user info to the request object
      req.user = decoded;

      // Check if the user has an admin role
      if (req.user.role !== 'admin') {
        return res.status(403).json({ error: 'Access denied: User is not an admin' });
      }

      next();
    });
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return res.status(403).json({ message: 'Invalid token' });
  }
};

module.exports = { userAuth, adminAuth };
