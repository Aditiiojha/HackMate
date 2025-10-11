import express from 'express';
import { protect } from '../middleware/auth.middleware.js';
import {
  getUserProfile,
  updateUserProfile,
  updateProfilePicture, // Make sure this is imported
} from '../controllers/user.controller.js';
import upload from '../config/cloudinary.js';

const router = express.Router();

// Route for getting and updating user profile text data
router
  .route('/profile')
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

// Route specifically for updating the profile picture
// This line is probably missing from your file
router
  .route('/profile/picture')
  .put(protect, upload.single('profilePicture'), updateProfilePicture);

export default router;