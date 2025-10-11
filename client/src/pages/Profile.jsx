// src/pages/Profile.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiEdit, FiSave, FiCamera } from 'react-icons/fi';

// Import both the default service and the named function
import userService, { updateUserProfile } from '../services/userService';

// Certificate components
import CertificateUploader from '../components/profile/CertificateUploader';
import CertificateList from '../components/profile/CertificateList';

const Profile = () => {
  const { dbUser, setDbUser } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({ name: '', bio: '', year: '', skills: [] });
  const [loading, setLoading] = useState(false);

  // Profile picture state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const defaultAvatar = 'https://i.ibb.co/615GA2V/default-avatar.png';

  const [certificateRefreshTrigger, setCertificateRefreshTrigger] = useState(0);

  useEffect(() => {
    if (dbUser) {
      setProfileData({
        name: dbUser.name || '',
        bio: dbUser.bio || '',
        year: dbUser.year || '',
        skills: dbUser.skills || [],
      });
    }
  }, [dbUser]);

  if (!dbUser) {
    return <div className="flex justify-center items-center min-h-screen">Loading profile...</div>;
  }

  // Photo handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('File too large. Max 5MB.');
      return;
    }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const handlePhotoUpload = async () => {
    if (!imageFile) return;
    setIsUploading(true);
    const toastId = toast.loading('Uploading photo...');
    try {
      const updatedUser = await userService.updateProfilePicture(imageFile);
      setDbUser(updatedUser);
      setImageFile(null);
      setImagePreview(null);
      toast.success('Photo updated!', { id: toastId });
    } catch (error) {
      toast.error(error?.message || 'Failed to upload photo.', { id: toastId });
    } finally {
      setIsUploading(false);
    }
  };

  // Save profile edits
  const handleSave = async () => {
    setLoading(true);
    try {
      const updatedUser = await updateUserProfile(profileData);
      setDbUser(updatedUser);
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error(error?.message || 'Failed to update profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillsChange = (e) => {
    const skillsArray = e.target.value.split(',').map((s) => s.trim()).filter(Boolean);
    setProfileData({ ...profileData, skills: skillsArray });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Profile Details Card */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6">
            {/* Header with picture */}
            <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6 mb-6">
              <div className="relative">
                <img
                  src={imagePreview || dbUser.profilePicture || defaultAvatar}
                  alt="Profile"
                  className="w-24 h-24 rounded-full object-cover border-4 border-gray-200"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute bottom-0 right-0 bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700"
                  aria-label="Change photo"
                >
                  <FiCamera size={16} />
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept="image/*"
                  className="hidden"
                />
              </div>
              <div className="text-center sm:text-left">
                <h1 className="text-2xl font-bold text-gray-800">{dbUser.name}</h1>
                <p className="text-gray-500">{dbUser.email}</p>
              </div>
            </div>

            {imageFile && (
              <div className="flex items-center justify-center gap-4 my-4 p-3 bg-gray-50 rounded-lg">
                <p className="text-sm font-medium text-gray-700">New photo selected.</p>
                <button
                  onClick={handlePhotoUpload}
                  disabled={isUploading}
                  className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
                >
                  {isUploading ? 'Uploading...' : 'Save Photo'}
                </button>
                <button
                  onClick={() => { setImageFile(null); setImagePreview(null); }}
                  className="text-sm text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
              </div>
            )}

            <div className="flex justify-between items-center mb-4 border-t pt-4">
              <h2 className="text-xl font-bold text-gray-800">Your Details</h2>
              <button
                onClick={() => setIsEditing((v) => !v)}
                className="flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
              >
                {isEditing ? 'Cancel' : (<><FiEdit className="mr-2" /> Edit Details</>)}
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <input
                  type="text"
                  value={profileData.name}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea
                  value={profileData.bio}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                  rows="3"
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Year of Study</label>
                <input
                  type="number"
                  value={profileData.year}
                  disabled={!isEditing}
                  onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Skills (comma separated)</label>
                <input
                  type="text"
                  value={profileData.skills.join(', ')}
                  disabled={!isEditing}
                  onChange={handleSkillsChange}
                  className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm disabled:bg-gray-100"
                />
              </div>

              {isEditing && (
                <button
                  onClick={handleSave}
                  disabled={loading}
                  className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
                >
                  <FiSave className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Certificates Section */}
        <div className="space-y-6">
          <CertificateUploader
            onUploadSuccess={() => setCertificateRefreshTrigger((n) => n + 1)}
          />
          <CertificateList refreshTrigger={certificateRefreshTrigger} />
        </div>
      </div>
    </div>
  );
};

export default Profile;
