import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import userService from '../../services/userService';
import toast from 'react-hot-toast';
import { FiLock, FiUsers, FiGlobe } from 'react-icons/fi';

const privacyOptions = [
  { value: 'PUBLIC', label: 'Public', icon: FiGlobe, description: 'Any registered user can view your profile.' },
  { value: 'GROUP_MEMBERS', label: 'Only Group Members', icon: FiUsers, description: 'Only users who share a common group with you can view your profile.' },
  { value: 'ACCEPTED_CONNECTIONS', label: 'Only Connections', icon: FiLock, description: 'Only users you have accepted as a connection can view your profile.' },
];

const ProfilePrivacySettings = () => {
  const { dbUser, setDbUser } = useAuth();
  const [currentPrivacy, setCurrentPrivacy] = useState(dbUser?.profilePrivacy || 'PUBLIC');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (dbUser?.profilePrivacy) {
      setCurrentPrivacy(dbUser.profilePrivacy);
    }
  }, [dbUser]);

  const handlePrivacyChange = async (newValue) => {
    if (newValue === currentPrivacy) return;

    setLoading(true);
    const toastId = toast.loading(`Updating privacy to ${newValue.replace('_', ' ')}...`);
    
    try {
      const response = await userService.updateProfilePrivacy(newValue);
      
      // Update local state and Auth context state
      setCurrentPrivacy(response.profilePrivacy);
      setDbUser(prevUser => ({ ...prevUser, profilePrivacy: response.profilePrivacy }));

      toast.success('Privacy setting updated!', { id: toastId });
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update privacy setting.';
      toast.error(message, { id: toastId });
      // Revert to original value on error
      setCurrentPrivacy(dbUser?.profilePrivacy || 'PUBLIC');
    } finally {
      setLoading(false);
    }
  };

  if (!dbUser) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-yellow-200">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <FiLock className="mr-2 text-yellow-600" /> Profile Privacy Settings
      </h3>
      <p className="text-sm text-gray-500 mb-4">Control who can view your profile details (excluding public data like name/avatar).</p>

      <div className="space-y-3">
        {privacyOptions.map((option) => (
          <label key={option.value} className="flex items-start p-3 border border-gray-200 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              name="profilePrivacy"
              value={option.value}
              checked={currentPrivacy === option.value}
              onChange={() => handlePrivacyChange(option.value)}
              disabled={loading}
              className="mt-1 mr-3 w-5 h-5 text-indigo-600 border-gray-300 focus:ring-indigo-500 disabled:opacity-50"
            />
            <div className="flex flex-col">
              <span className="text-sm font-semibold text-gray-700 flex items-center">
                <option.icon className="mr-2 text-indigo-500" size={14} /> {option.label}
              </span>
              <span className="text-xs text-gray-500">{option.description}</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};

export default ProfilePrivacySettings;