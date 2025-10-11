import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupById } from '../services/groupService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiUsers, FiClipboard, FiArrowLeft, FiEdit } from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ApplicationForm from '../components/groups/ApplicationForm';
import ApplicationList from '../components/groups/ApplicationList';
import EditGroupForm from '../components/groups/EditGroupForm';
import ChatWindow from '../components/chat/ChatWindow';

const GroupDetails = () => {
  const { groupId } = useParams();
  const { dbUser } = useAuth();
  
  const [group, setGroup] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplicationModal, setShowApplicationModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const fetchGroupData = useCallback(async () => {
    if (!groupId) return;
    try {
      setLoading(true);
      const fetchedGroup = await getGroupById(groupId, { t: Date.now() });
      setGroup(fetchedGroup);
    } catch (err) {
      setError(err.message || 'Could not fetch group details.');
      toast.error(err.message || 'Could not fetch group details.');
    } finally {
      setLoading(false);
    }
  }, [groupId]);

  useEffect(() => {
    fetchGroupData();
  }, [fetchGroupData, refreshTrigger]);

  const handleUpdateSuccess = useCallback(() => {
    fetchGroupData();
    setShowEditModal(false);
  }, [fetchGroupData]);

  const isLeader = dbUser?._id?.toString() === group?.leaderId?._id?.toString();
  const isMember = group?.members?.some(member => member._id.toString() === dbUser?._id?.toString());
  
  const renderActionButtons = () => {
    if (group?.status === 'disbanded') {
      return <p className="text-center font-semibold text-gray-600 bg-gray-200 py-3 rounded-md">Group Disbanded</p>;
    }
    if (isLeader) {
      return <button onClick={() => setShowEditModal(true)} className="w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 flex items-center justify-center"><FiEdit className="mr-2"/> Manage Team</button>;
    }
    if (isMember) {
      return <p className="text-center font-semibold text-green-600 bg-green-100 py-3 rounded-md">You are a member</p>;
    }
    return <button onClick={() => setShowApplicationModal(true)} className="w-full px-6 py-3 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700">Apply to Join</button>;
  };

  if (loading) return <div className="text-center p-10">Loading group details...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!group) return <div className="text-center p-10">Group not found.</div>;

  return (
    <>
      <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto">
            <Link to="/groups" className="inline-flex items-center mb-4 text-indigo-600 hover:underline">
                <FiArrowLeft className="mr-2"/> Back to All Teams
            </Link>
            <div className="bg-white rounded-lg shadow-lg overflow-hidden mb-8">
              <div className="p-6">
                <h1 className="text-3xl font-bold text-gray-900">{group.name}</h1>
                <p className="mt-1 text-md text-indigo-700 font-semibold">{group.hackathonName}</p>
                <div className="flex flex-wrap gap-2 my-4">
                    {group.tags.map(tag => <span key={tag} className="px-3 py-1 text-xs font-semibold text-gray-800 bg-gray-200 rounded-full">{tag}</span>)}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="md:col-span-2">
                        <h2 className="text-xl font-semibold text-gray-800 border-b pb-2 mb-3">Description</h2>
                        <p className="text-gray-600 whitespace-pre-wrap">{group.description}</p>
                        {group.applicationForm.length > 0 && (
                            <div className="mt-6">
                                <h3 className="text-lg font-semibold text-gray-800 border-b pb-2 mb-3 flex items-center"><FiClipboard className="mr-2"/> Application Questions</h3>
                                <ul className="list-disc list-inside space-y-2 text-gray-700">
                                    {group.applicationForm.map(item => <li key={item._id}>{item.question}</li>)}
                                </ul>
                            </div>
                        )}
                    </div>
                    <div className="md:col-span-1 space-y-6">
                        <div className="p-4 bg-gray-50 rounded-lg border">
                            <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center"><FiUsers className="mr-2"/> Members ({group.members?.length || 0}/{group.memberLimit})</h3>
                            <div className="space-y-3">
                                {group.members && group.members
                                    .filter(member => member) 
                                    .map(member => (
                                        <div key={member._id} className="flex items-center space-x-3">
                                            <img src={member.profilePicture} alt={member.name} className="w-10 h-10 rounded-full object-cover"/>
                                            <div>
                                                <p className="font-semibold text-gray-800">{member.name}</p>
                                                <p className="text-xs text-gray-500">{member._id === group.leaderId._id ? 'Leader' : 'Member'}</p>
                                            </div>
                                        </div>
                                ))}
                            </div>
                        </div>
                        <div className="mt-4">{renderActionButtons()}</div>
                    </div>
                </div>
              </div>
              {isLeader && group.status === 'open' && (
                <div className="border-t border-gray-200 p-6 bg-gray-50">
                  <ApplicationList groupId={group._id} onAction={() => setRefreshTrigger(p => p + 1)} />
                </div>
              )}
            </div>
            
            {isMember && group.status === 'open' && (
                <div className="mt-8">
                    <ChatWindow groupId={group._id} />
                </div>
            )}
          </div>
      </div>

      <Modal isOpen={showApplicationModal} onClose={() => setShowApplicationModal(false)} title={`Apply to ${group.name}`}>
        <ApplicationForm group={group} onClose={() => setShowApplicationModal(false)} onApplySuccess={() => {}}/>
      </Modal>

      <Modal isOpen={showEditModal} onClose={() => setShowEditModal(false)} title="Edit Team Details">
          <EditGroupForm
            group={group}
            onClose={() => setShowEditModal(false)}
            onUpdateSuccess={handleUpdateSuccess}
          />
      </Modal>
    </>
  );
};

export default GroupDetails;