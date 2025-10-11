import admin from 'firebase-admin';
import User from '../models/user.model.js';

export const protect = async (req, res, next) => {
  try {
    const hdr = req.headers.authorization || '';
    const token = hdr.startsWith('Bearer ') ? hdr.split(' ')[1] : null;
    if (!token) return res.status(401).json({ message: 'Not authorized, no token provided.' });

    const decoded = await admin.auth().verifyIdToken(token); // verifies Firebase ID token

    // Find Mongo user by Firebase UID
    const user = await User.findOne({ uid: decoded.uid }).select('-password');
    if (!user) return res.status(401).json({ message: 'User not found in database.' });

    req.user = user;         // full user document
    req.userId = user._id;   // convenience
    return next();
  } catch (err) {
    console.error('Token verification failed:', err);
    return res.status(401).json({ message: 'Not authorized, token failed.' });
  }
};
