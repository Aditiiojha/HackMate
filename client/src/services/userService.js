// src/services/userService.js
import API from './api'; // axios instance

// Upload a new profile picture
export const updateProfilePicture = async (file) => {
  const formData = new FormData();
  formData.append('profilePicture', file);
  const res = await API.put('/api/users/profile/picture', formData);
  return res.data;
};

// Update profile data (name, bio, etc.)
export const updateUserProfile = async (profileData) => {
  const res = await API.put('/api/users/profile', profileData);
  return res.data;
};

// Default aggregate export for convenience
const userService = {
  updateProfilePicture,
  updateUserProfile,
};
export default userService;
