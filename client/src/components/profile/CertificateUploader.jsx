import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUploadCloud, FiX, FiCheckCircle, FiBookOpen, FiCalendar, FiFile } from 'react-icons/fi';
import { uploadCertificate } from '../../services/certificateService'; // Assumes this service exists

const CertificateUploader = ({ onUploadSuccess }) => {
    const [file, setFile] = useState(null);
    const [hackathonName, setHackathonName] = useState('');
    const [issuedAt, setIssuedAt] = useState('');
    const [uploading, setUploading] = useState(false);

    // ... (All handlers remain unchanged)

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
            const maxSize = 5 * 1024 * 1024; // 5MB

            if (!allowedTypes.includes(selectedFile.type)) {
                toast.error('Only JPG, PNG, and PDF files are allowed.');
                setFile(null);
                return;
            }

            if (selectedFile.size > maxSize) {
                toast.error('File size must be less than 5MB.');
                setFile(null);
                return;
            }

            setFile(selectedFile);
        }
    };

    const handleRemoveFile = () => {
        setFile(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            return toast.error('Please select a file to upload.');
        }
        if (!hackathonName.trim()) {
            return toast.error('Please enter the hackathon name.');
        }
        if (!issuedAt) {
            return toast.error('Please select an issue date.');
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('certificate', file);
        formData.append('hackathonName', hackathonName);
        formData.append('issuedAt', issuedAt);

        try {
            await uploadCertificate(formData);
            toast.success('Certificate uploaded successfully!');
            
            // Clear form
            setFile(null);
            setHackathonName('');
            setIssuedAt('');
            
            onUploadSuccess(); // Trigger parent to refresh list
        } catch (error) {
            toast.error(error.message || 'Failed to upload certificate.');
        } finally {
            setUploading(false);
        }
    };

    // Input classes: Use standard white text on dark background for visibility
    const inputClasses = "w-full px-4 py-3 text-white border border-white/10 rounded-lg shadow-inner transition duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none";
    const darkInputBackground = "bg-white/5"; // Ensure background is dark for contrast
    const labelClasses = "block text-sm font-semibold text-gray-300 mb-2 flex items-center";

    return (
        <div className="p-0">
            <h3 className="text-2xl font-bold text-indigo-400 mb-6 flex items-center">
                <FiUploadCloud className="mr-3"/> Upload New Certificate
            </h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* File Input */}
                <div className="border border-white/10 rounded-xl p-4 bg-white/5">
                    <label className={labelClasses}>
                        <FiFile className="w-4 h-4 mr-2 text-indigo-400"/> Certificate File (JPG, PNG, PDF max 5MB)
                    </label>
                    <div className="flex items-center space-x-3">
                        <label className="cursor-pointer px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 transition">
                            Choose file
                            <input type="file" onChange={handleFileChange} accept=".jpg,.jpeg,.png,.pdf" className="hidden" />
                        </label>
                        <span className="text-gray-400 text-sm truncate">
                            {file ? file.name : "No file chosen"}
                        </span>
                        {file && (
                            <button
                                type="button"
                                onClick={handleRemoveFile}
                                className="p-2 text-red-400 hover:text-white rounded-full transition"
                                aria-label="Remove file"
                            >
                                <FiX size={20} />
                            </button>
                        )}
                    </div>
                </div>

                {/* Hackathon Name */}
                <div>
                    <label htmlFor="hackathonName" className={labelClasses}>
                        <FiBookOpen className="w-4 h-4 mr-2 text-indigo-400"/> Hackathon Name
                    </label>
                    <input
                        type="text"
                        id="hackathonName"
                        value={hackathonName}
                        onChange={(e) => setHackathonName(e.target.value)}
                        className={`${inputClasses} ${darkInputBackground}`}
                        placeholder="e.g., Global AI Hackathon 2023"
                        required
                    />
                </div>

                {/* Issued At Date (Optimized Block) */}
                <div>
                    <label htmlFor="issuedAt" className={labelClasses}>
                        <FiCalendar className="w-4 h-4 mr-2 text-indigo-400"/> Date Issued
                    </label>
                    <div className="relative">
                        {/* We use the native date input which is best for accessibility. */}
                        {/* The custom styling will ensure the text is visible (white). */}
                        <input
                            type="date"
                            id="issuedAt"
                            value={issuedAt}
                            onChange={(e) => setIssuedAt(e.target.value)}
                            // Applying dark input classes
                            className={`${inputClasses} ${darkInputBackground}`} 
                            required
                        />
                    </div>
                </div>

                {/* Submit Button (Neon CTA) */}
                <button
                    type="submit"
                    className="btn-neon-primary w-full py-3 mt-4 flex items-center justify-center text-lg"
                    disabled={uploading || !file || !hackathonName.trim() || !issuedAt}
                >
                    {uploading ? (
                        'Uploading...'
                    ) : (
                        <>
                            <FiUploadCloud className="mr-2 h-6 w-6" /> Upload Certificate
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default CertificateUploader;