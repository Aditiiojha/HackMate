import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FiUpload, FiX, FiCheckCircle } from 'react-icons/fi';
import { uploadCertificate } from '../../services/certificateService'; // We will create this service next

const CertificateUploader = ({ onUploadSuccess }) => {
  const [file, setFile] = useState(null);
  const [hackathonName, setHackathonName] = useState('');
  const [issuedAt, setIssuedAt] = useState('');
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      // Basic validation for file types and size
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
      // This service will handle the actual file upload (e.g., to Cloudinary)
      // and send the metadata to our backend API.
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

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">Upload New Certificate</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* File Input */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Certificate File (JPG, PNG, PDF max 5MB)</label>
          <div className="flex items-center space-x-2">
            <input
              type="file"
              onChange={handleFileChange}
              accept=".jpg,.jpeg,.png,.pdf"
              className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
            />
            {file && (
              <button
                type="button"
                onClick={handleRemoveFile}
                className="p-2 text-red-500 hover:text-red-700 rounded-full bg-red-100"
                aria-label="Remove file"
              >
                <FiX size={20} />
              </button>
            )}
          </div>
          {file && <p className="mt-2 text-sm text-gray-500">Selected: {file.name}</p>}
        </div>

        {/* Hackathon Name */}
        <div>
          <label htmlFor="hackathonName" className="block text-sm font-medium text-gray-700 mb-1">Hackathon Name</label>
          <input
            type="text"
            id="hackathonName"
            value={hackathonName}
            onChange={(e) => setHackathonName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            placeholder="e.g., Global AI Hackathon 2023"
            required
          />
        </div>

        {/* Issued At Date */}
        <div>
          <label htmlFor="issuedAt" className="block text-sm font-medium text-gray-700 mb-1">Date Issued</label>
          <input
            type="date"
            id="issuedAt"
            value={issuedAt}
            onChange={(e) => setIssuedAt(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-indigo-500 focus:border-indigo-500"
            required
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          disabled={uploading || !file || !hackathonName.trim() || !issuedAt}
        >
          {uploading ? (
            'Uploading...'
          ) : (
            <>
              <FiUpload className="mr-2 h-5 w-5" /> Upload Certificate
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default CertificateUploader;