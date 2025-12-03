const jwt = require('jsonwebtoken');
const User = require('../models/User');

// 🔒 Middleware to protect routes
exports.protect = async (req, res, next) => {
  try {
    let token;

    // ✅ Extract token from header (Bearer <token>)
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    // 🚫 No token → deny access
    if (!token) {
      return res.status(401).json({ message: 'No token, authorization denied' });
    }

    // ✅ Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultsecret');

    // ✅ Find user and attach to req.user (without password)
    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      return res.status(401).json({ message: 'User not found' });
    }

    req.user = { id: user._id, email: user.email, name: user.name }; // clean object
    next();
  } catch (err) {
    console.error('❌ Auth Middleware Error:', err.message);
    res.status(401).json({ message: 'Not authorized, invalid or expired token' });
  }
};
