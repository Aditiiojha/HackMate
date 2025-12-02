import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiEdit, FiSave, FiCamera, FiMail, FiUser, FiCode, FiCalendar, FiBookOpen } from 'react-icons/fi';

// Import both the default service and the named function
import userService, { updateUserProfile } from '../services/userService';

// Certificate components
import CertificateUploader from '../components/profile/CertificateUploader';
import CertificateList from '../components/profile/CertificateList';

// --- Custom UI Component for Inputs ---
// Reusable Dark Mode Input Field
const DarkInput = ({ label, name, value, disabled, onChange, type = 'text', icon: Icon, placeholder, isTextArea = false }) => (
    <div>
        <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
            {Icon && <Icon className="w-4 h-4 mr-2 text-indigo-400" />} {label}
        </label>
        {isTextArea ? (
            <textarea
                name={name}
                value={value}
                disabled={disabled}
                onChange={onChange}
                rows="3"
                placeholder={placeholder}
                className="mt-1 block w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-lg shadow-inner transition duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-white/10 disabled:text-gray-400 disabled:border-white/5 resize-none"
            />
        ) : (
            <input
                type={type}
                name={name}
                value={value}
                disabled={disabled}
                onChange={onChange}
                placeholder={placeholder}
                className="mt-1 block w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-lg shadow-inner transition duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 disabled:bg-white/10 disabled:text-gray-400 disabled:border-white/5"
            />
        )}
    </div>
);

const Profile = () => {
    const { dbUser, setDbUser } = useAuth();

    const [isEditing, setIsEditing] = useState(false);
    const [profileData, setProfileData] = useState({ name: '', bio: '', year: '', skills: [] });
    const [loading, setLoading] = useState(false);
    
    // FIX: New state to hold the raw string value of the skills input
    const [skillsInputValue, setSkillsInputValue] = useState('');

    // Profile picture state
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef(null);
    const defaultAvatar = 'https://i.ibb.co/615GA2V/default-avatar.png';

    const [certificateRefreshTrigger, setCertificateRefreshTrigger] = useState(0);

    useEffect(() => {
        if (dbUser) {
            const initialSkillsString = dbUser.skills?.join(', ') || '';
            
            setProfileData({
                name: dbUser.name || '',
                bio: dbUser.bio || '',
                year: dbUser.year || '',
                skills: dbUser.skills || [],
            });
            // FIX: Initialize the local string state
            setSkillsInputValue(initialSkillsString);
        }
    }, [dbUser]);

    if (!dbUser) {
        return <div className="flex justify-center items-center min-h-screen text-white bg-slate-900">Loading profile...</div>;
    }

    // Photo handlers (Unchanged)
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
        
        // FIX: Parse the skills from the local input string ONLY on save
        const finalSkillsArray = skillsInputValue.split(',').map((s) => s.trim()).filter(Boolean);
        const dataToSave = { ...profileData, skills: finalSkillsArray };

        try {
            const updatedUser = await updateUserProfile(dataToSave);
            setDbUser(updatedUser);
            toast.success('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            toast.error(error?.message || 'Failed to update profile.');
        } finally {
            setLoading(false);
        }
    };

    // FIX: Simple handler to update the local string state directly
    const handleSkillsChange = (e) => {
        setSkillsInputValue(e.target.value);
    };

    return (
        // Apply dark background
        <div className="min-h-screen bg-slate-900 p-4 sm:p-6 lg:p-8">
            <div className="max-w-4xl mx-auto space-y-8">
                
                {/* Header Title */}
                <h1 className="text-4xl md:text-5xl font-extrabold text-white pt-4 text-neon-glow-small">
                    Hacker Profile
                </h1>

                {/* Profile Details Card (Glassmorphism) */}
                <div className="glass-card p-8 rounded-2xl shadow-xl border border-white/10">
                    
                    {/* Header with picture and controls */}
                    <div className="flex justify-between items-start mb-6 border-b border-white/10 pb-6">
                        
                        {/* Profile Info */}
                        <div className="flex items-center space-x-6">
                            <div className="relative group">
                                <img
                                    src={imagePreview || dbUser.profilePicture || defaultAvatar}
                                    alt="Profile"
                                    className="w-28 h-28 rounded-full object-cover border-4 border-indigo-500/50 shadow-lg transition-all duration-300 ring-4 ring-indigo-500/20"
                                />
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    className="absolute inset-0 w-full h-full rounded-full bg-black/50 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-300"
                                    aria-label="Change photo"
                                >
                                    <FiCamera size={20} className="text-indigo-400" />
                                </button>
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    onChange={handleFileChange}
                                    accept="image/*"
                                    className="hidden"
                                />
                            </div>
                            <div className="text-left">
                                <h2 className="text-3xl font-extrabold text-white text-neon-glow-name">{dbUser.name}</h2>
                                <p className="text-gray-400 flex items-center mt-1">
                                    <FiMail className="mr-2 w-4 h-4"/> {dbUser.email}
                                </p>
                            </div>
                        </div>

                        {/* Edit/Save Button */}
                        <button
                            onClick={() => setIsEditing((v) => !v)}
                            className={`flex items-center px-4 py-2 text-sm font-medium rounded-full transition-colors ${isEditing 
                                ? 'bg-red-600 text-white hover:bg-red-700' 
                                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/30'}`}
                        >
                            {isEditing ? 'Cancel Edit' : (<><FiEdit className="mr-2" /> Edit Profile</>)}
                        </button>
                    </div>

                    {/* Photo Upload Confirmation */}
                    {imageFile && (
                        <div className="flex items-center justify-between gap-4 my-4 p-4 bg-white/10 rounded-xl border border-green-500/50">
                            <p className="text-sm font-medium text-gray-300">New photo ready to upload: {imageFile.name}</p>
                            <div className="flex space-x-2">
                                <button
                                    onClick={handlePhotoUpload}
                                    disabled={isUploading}
                                    className="px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
                                >
                                    {isUploading ? 'Uploading...' : 'Save Photo'}
                                </button>
                                <button
                                    onClick={() => { setImageFile(null); setImagePreview(null); }}
                                    className="text-sm text-gray-400 hover:text-white border border-gray-400/50 px-3 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* --- Profile Editing Section --- */}
                    <div className="space-y-6 pt-4">
                        
                        {/* Name Input */}
                        <DarkInput
                            label="Name"
                            name="name"
                            icon={FiUser}
                            value={profileData.name}
                            disabled={!isEditing}
                            onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                        />

                        {/* Bio Textarea */}
                        <DarkInput
                            label="Bio (Tell us about yourself)"
                            name="bio"
                            icon={FiBookOpen}
                            value={profileData.bio}
                            disabled={!isEditing}
                            onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                            isTextArea={true}
                        />

                        {/* Year of Study */}
                        <DarkInput
                            label="Year of Study"
                            name="year"
                            icon={FiCalendar}
                            type="number"
                            value={profileData.year}
                            disabled={!isEditing}
                            onChange={(e) => setProfileData({ ...profileData, year: e.target.value })}
                        />

                        {/* Skills Input */}
                        <DarkInput
                            label="Skills (comma separated - e.g., React, Node.js, Design)"
                            name="skills"
                            icon={FiCode}
                            placeholder="Enter your key skills here"
                            // FIX: Use the local string state for the input value
                            value={skillsInputValue} 
                            disabled={!isEditing}
                            // FIX: Use the simplified handler
                            onChange={handleSkillsChange}
                        />

                        {/* Display Skills as Tags (Read-only mode) */}
                        {!isEditing && profileData.skills.length > 0 && (
                            <div className="pt-2">
                                <h3 className="text-lg font-semibold text-indigo-400 mb-2">My Current Skills:</h3>
                                <div className="flex flex-wrap gap-2">
                                    {profileData.skills.map((skill, index) => (
                                        <span key={index} className="px-3 py-1 text-sm font-medium text-white bg-indigo-500/70 rounded-full border border-indigo-400/50 shadow-md">
                                            {skill}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {isEditing && (
                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className="flex items-center justify-center w-full px-4 py-3 text-lg font-medium text-white bg-green-600 rounded-xl hover:bg-green-700 disabled:bg-green-400 shadow-lg shadow-green-500/30 transition-colors"
                            >
                                <FiSave className="mr-2" /> {loading ? 'Saving...' : 'Save Changes'}
                            </button>
                        )}
                    </div>
                </div>

                {/* Certificates Section */}
                <h2 className="text-3xl font-bold text-white pt-4 text-neon-glow-small">Certifications</h2>
                <div className="space-y-6">
                    {/* The CertificateUploader and CertificateList components will automatically inherit the dark container styling from their parents if they use glass-card too, or they will be placed here: */}
                    <div className="glass-card p-6 rounded-2xl shadow-xl border border-white/10">
                         <CertificateUploader
                            onUploadSuccess={() => setCertificateRefreshTrigger((n) => n + 1)}
                         />
                    </div>
                    <div className="glass-card p-6 rounded-2xl shadow-xl border border-white/10">
                        <CertificateList refreshTrigger={certificateRefreshTrigger} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;