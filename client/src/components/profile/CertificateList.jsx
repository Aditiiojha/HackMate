import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getMyCertificates } from '../../services/certificateService'; // Assumes this service exists
import { FiExternalLink, FiDownload, FiCalendar, FiBookOpen, FiClock, FiFileText } from 'react-icons/fi';

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

    if (loading) return (
        <div className="text-center text-gray-400 flex items-center justify-center py-8">
            <FiClock className="animate-spin mr-3"/> Loading certificates...
        </div>
    );
    if (error) return <p className="text-red-400 p-4 border border-red-500/50 rounded-xl bg-red-900/20">Error: {error}</p>;

    const formatDate = (dateString) => {
        // Ensure dateString is not null or undefined before converting
        if (!dateString) return 'N/A';
        try {
            return new Date(dateString).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            });
        } catch {
            return dateString;
        }
    };

    if (certificates.length === 0) {
        return (
            <div className="text-center text-gray-400 italic py-8 border border-white/10 rounded-xl bg-white/5">
                You haven't uploaded any certificates yet.
            </div>
        );
    }

    return (
        <div className="space-y-4">
            <h3 className="text-2xl font-bold text-indigo-400 mb-4 flex items-center">
                 <FiFileText className="mr-3"/> My Certifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {certificates.map((cert) => (
                    // Certificate item card with Glassmorphism hover effect
                    <div key={cert._id} className="bg-white/5 p-4 rounded-xl border border-white/10 shadow-md flex flex-col justify-between transition-all duration-300 hover:bg-white/10 hover:shadow-indigo-500/20">
                        <div>
                            {/* Hackathon Name */}
                            <p className="font-bold text-white text-lg flex items-center">
                                <FiBookOpen className="mr-2 w-4 h-4 text-indigo-400"/>{cert.hackathonName}
                            </p>
                            {/* Issued Date */}
                            <div className="flex items-center text-sm text-gray-400 mt-1">
                                <FiCalendar className="mr-2 w-4 h-4" />
                                <span>Issued on {formatDate(cert.issuedAt)}</span>
                            </div>
                        </div>
                        {/* View/Download Link */}
                        <a
                            href={cert.fileUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="mt-4 inline-flex items-center justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 shadow-md shadow-indigo-500/30 transition-colors"
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