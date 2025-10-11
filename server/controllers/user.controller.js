import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js'; // Assuming you have an error handler utility

/**
 * @desc    Get the current user's profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    // req.user is attached by the 'protect' middleware, so we can send it directly.
    // We re-fetch to ensure we have the absolute latest data.
    const user = await User.findById(req.user._id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.error('Get User Profile Error:', error);
    res.status(500).json({ message: 'Server error while fetching profile.' });
  }
};

/**
 * @desc    Update the current user's profile (name, bio, skills, etc.)
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      // Update fields from the request body, falling back to existing value if not provided
      user.name = req.body.name || user.name;
      user.bio = req.body.bio || user.bio;
      user.year = req.body.year || user.year;
      user.skills = req.body.skills || user.skills;
      
      const updatedUser = await user.save();
      const userObj = updatedUser.toObject();
      delete userObj.password; // Ensure password is not sent back
      res.status(200).json(userObj);
    } else {
      res.status(404).json({ message: 'User not found.' });
    }
  } catch (error) {
    console.error('Profile Update Error:', error);
    res.status(500).json({ message: 'Server error while updating profile.' });
  }
};

/**
 * @desc    Update the current user's profile picture
 * @route   PUT /api/users/profile/picture
 * @access  Private
 */
export const updateProfilePicture = async (req, res) => {
  try {
    // The 'upload' middleware provides the file details if the upload was successful
    if (!req.file) {
      return res.status(400).json({ message: 'No image file uploaded.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // You should also delete the old image from Cloudinary here
    // if (user.profilePicturePublicId) {
    //   await cloudinary.uploader.destroy(user.profilePicturePublicId);
    // }

    // Update the user's profile picture with the URL and public_id from Cloudinary
    user.profilePicture = req.file.path;
    user.profilePicturePublicId = req.file.filename; // The public_id from multer-storage-cloudinary
    
    const updatedUser = await user.save();
    const userObj = updatedUser.toObject();
    delete userObj.password;
    res.status(200).json(userObj);
  } catch (error) {
    console.error('Profile Picture Update Error:', error);
    res.status(500).json({ message: 'Server error while updating profile picture.' });
  }
};

/**
 * @desc    Delete the current user's account
 * @route   DELETE /api/users/profile
 * @access  Private
 */
export const deleteUser = async (req, res, next) => {
    // In this setup, the protect middleware already confirms the user exists.
    // The ID in req.user._id is the one we should use.
    try {
      await User.findByIdAndDelete(req.user._id);
      
      // Clear the access_token cookie to log them out
      res.clearCookie('access_token');
      
      // Send a success response
      res.status(200).json({ message: 'User has been deleted.' });
    } catch (error) {
      next(error);
    }
};