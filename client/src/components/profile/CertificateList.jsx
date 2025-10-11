import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMyCertificates } from '../../services/certificateService'; // Assumes this service exists
import { FiExternalLink, FiDownload, FiCalendar } from 'react-icons/fi';

const CertificateList = ({ refreshTrigger }) => {
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCertificates = async () => {
      try {
        setLoading(true);
        const data = await getMyCertificates();
        setCertificates(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Could not fetch certificates.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCertificates();
  }, [refreshTrigger]); // Refreshes when the parent component signals an update

  if (loading) return <p className="text-gray-500">Loading certificates...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;

  if (certificates.length === 0) {
    return (
      <div className="text-center py-6 bg-gray-50 rounded-lg">
        <p className="text-gray-600">You haven't uploaded any certificates yet.</p>
      </div>
    );
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-gray-800 mb-4">My Certificates</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {certificates.map((cert) => (
          <div key={cert._id} className="bg-white p-4 rounded-lg border shadow-sm flex flex-col justify-between">
            <div>
              <p className="font-bold text-gray-900">{cert.hackathonName}</p>
              <div className="flex items-center text-sm text-gray-500 mt-1">
                <FiCalendar className="mr-2" />
                <span>Issued on {formatDate(cert.issuedAt)}</span>
              </div>
            </div>
            <a
              href={cert.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
            >
              <FiExternalLink className="mr-2" /> View Certificate
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateList;