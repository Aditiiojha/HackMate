import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { getApplicationsForGroup, updateApplicationStatus } from '../../services/applicationService';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';

const ApplicationList = ({ groupId, onAction }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [processingId, setProcessingId] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      if (!groupId) return;
      try {
        setLoading(true);
        const data = await getApplicationsForGroup(groupId);
        setApplications(data);
      } catch (err) {
        setError(err.message);
        toast.error(err.message || 'Could not fetch applications.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, [groupId]);

  const handleAction = async (applicationId, status) => {
    setProcessingId(applicationId);
    try {
      await updateApplicationStatus(applicationId, status);
      toast.success(`Application ${status}.`);
      setApplications(prev => prev.filter(app => app._id !== applicationId));
      // If an applicant was accepted, notify the parent page to refresh the member list
      if (status === 'accepted' && onAction) {
        onAction();
      }
    } catch (err) {
      toast.error(err.message || `Failed to ${status} application.`);
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) return <p className="text-gray-500">Loading applications...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  
  const validApplications = applications.filter(app => app.applicantId);

  if (validApplications.length === 0) {
    return <p className="text-gray-600 bg-gray-50 p-4 rounded-md">No pending applications.</p>;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-gray-800 border-b pb-2">Pending Applications</h3>
      {validApplications.map(app => (
        <div key={app._id} className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="flex items-center space-x-4 mb-4">
            <img src={app.applicantId.profilePicture} alt={app.applicantId.name} className="w-12 h-12 rounded-full object-cover" />
            <div>
              <p className="font-bold text-gray-900">{app.applicantId.name}</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {(app.applicantId.skills || []).slice(0, 3).map(skill => (
                  <span key={skill} className="px-2 py-0.5 text-xs bg-indigo-100 text-indigo-800 rounded-full">{skill}</span>
                ))}
              </div>
            </div>
          </div>
          
          <div className="space-y-2 mb-4">
            {app.answers.map((ans, index) => (
              <div key={index} className="text-sm">
                <p className="font-semibold text-gray-600">{ans.question}</p>
                <p className="text-gray-800 bg-gray-50 p-2 rounded-md mt-1">{ans.answer}</p>
              </div>
            ))}
          </div>

          <div className="flex justify-end space-x-3">
            <button
              onClick={() => handleAction(app._id, 'rejected')}
              disabled={processingId === app._id}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 disabled:bg-red-400"
            >
              <FiXCircle className="mr-2"/> Reject
            </button>
            <button
              onClick={() => handleAction(app._id, 'accepted')}
              disabled={processingId === app._id}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-green-600 rounded-md hover:bg-green-700 disabled:bg-green-400"
            >
              <FiCheckCircle className="mr-2"/> Accept
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ApplicationList;