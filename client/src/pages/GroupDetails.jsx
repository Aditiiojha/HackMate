import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getGroupById } from '../services/groupService';
import { useAuth } from '../hooks/useAuth';
import toast from 'react-hot-toast';
import { 
    FiUsers, 
    FiClipboard, 
    FiArrowLeft, 
    FiEdit, 
    FiZap, 
    FiTarget, 
    FiCheckCircle,
    // FIX: ADD FiMessageSquare here
    FiMessageSquare 
} from 'react-icons/fi';
import Modal from '../components/common/Modal';
import ApplicationForm from '../components/groups/ApplicationForm';
import ApplicationList from '../components/groups/ApplicationList';
import EditGroupForm from '../components/groups/EditGroupForm';
import ChatWindow from '../components/chat/ChatWindow';

// --- Styled Helper Components ---

const TagPill = ({ tag }) => (
    <span className="px-3 py-1 text-sm font-semibold text-indigo-300 bg-white/5 rounded-full border border-indigo-400/50 hover:bg-white/10 transition shadow-sm">
        {tag}
    </span>
);

const MemberDisplay = ({ member, isLeader, groupLeaderId }) => {
    const isCurrentLeader = member._id === groupLeaderId;
    const initials = member.name ? member.name.split(' ').map(n => n[0]).join('') : 'U';

    return (
        <div className="flex items-center space-x-3 p-2 hover:bg-white/5 rounded-lg transition duration-200">
            {member.profilePicture ? (
                 <img src={member.profilePicture} alt={member.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-indigo-400/50" />
            ) : (
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg ${isCurrentLeader ? 'bg-indigo-600' : 'bg-slate-700'} ring-2 ring-slate-800`}>
                    {initials}
                </div>
            )}
            
            <div>
                <p className={`font-semibold ${isCurrentLeader ? 'text-indigo-300' : 'text-white'}`}>{member.name}</p>
                <p className="text-xs text-gray-400">{isCurrentLeader ? 'Team Leader' : 'Team Member'}</p>
            </div>
        </div>
    );
};

// --- Main Component ---

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

    // Role Checks
    const isLeader = dbUser?._id?.toString() === group?.leaderId?._id?.toString();
    const isMember = group?.members?.some(member => member._id.toString() === dbUser?._id?.toString());
    
    // UI Logic
    const membersCount = group?.members?.length || 0;
    const memberLimit = group?.memberLimit || 0;
    const membersRemaining = memberLimit - membersCount;

    const renderActionButtons = () => {
        if (group?.status === 'disbanded') {
            return <p className="text-center font-semibold text-red-400 glass-card-red py-3 rounded-xl border border-red-500/30">Group Disbanded</p>;
        }
        if (isLeader) {
            return (
                <button 
                    onClick={() => setShowEditModal(true)} 
                    className="btn-neon-primary w-full flex items-center justify-center"
                >
                    <FiEdit className="mr-2"/> Manage Team Settings
                </button>
            );
        }
        if (isMember) {
            return <p className="text-center font-semibold text-green-400 glass-card-green py-3 rounded-xl border border-green-500/30 flex items-center justify-center"><FiCheckCircle className="mr-2"/> You are a Member</p>;
        }
        // Apply button for non-members
        return (
            <button 
                onClick={() => setShowApplicationModal(true)} 
                className="w-full px-6 py-3 font-semibold text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition duration-200 shadow-lg shadow-indigo-500/30"
            >
                Apply to Join
            </button>
        );
    };

    if (loading) return <div className="text-center p-10 text-white">Loading group details...</div>;
    if (error) return <div className="text-center p-10 text-red-500 glass-card">Error: {error}</div>;
    if (!group) return <div className="text-center p-10 text-white glass-card">Group not found.</div>;

    return (
        <>
            <div className="min-h-screen p-4 sm:p-6 lg:p-8 bg-slate-900">
                <div className="max-w-7xl mx-auto">
                    
                    {/* Back Link (Sleek) */}
                    <Link to="/groups" className="inline-flex items-center mb-6 text-indigo-400 hover:text-indigo-300 transition-colors">
                        <FiArrowLeft className="mr-2 w-5 h-5"/> Back to All Teams
                    </Link>

                    {/* --- Main Content Grid (Details & Actions) --- */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        
                        {/* Left Column: Team Info, Description, Applications */}
                        <div className="lg:col-span-2 space-y-8">
                            
                            {/* Team Info Header & Description (Glass Card) */}
                            <div className="glass-card p-8 rounded-2xl border border-white/10 shadow-xl">
                                <h1 className="text-5xl font-extrabold text-white mb-2 text-neon-glow">{group.name}</h1>
                                <p className="mt-1 text-xl text-indigo-400 font-semibold flex items-center mb-4">
                                    <FiZap className="mr-2 h-5 w-5"/> {group.hackathonName}
                                </p>
                                
                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 my-4 border-t border-white/10 pt-4">
                                    {group.tags.map(tag => <TagPill key={tag} tag={tag} />)}
                                </div>
                                
                                <h2 className="text-2xl font-bold text-gray-300 mt-6 mb-3">Description</h2>
                                <p className="text-gray-400 leading-relaxed border-l-4 border-indigo-500/50 pl-4 pb-2 whitespace-pre-wrap">
                                    {group.description}
                                </p>
                                
                                {/* Application Questions */}
                                {group.applicationForm.length > 0 && (
                                    <div className="mt-6 p-4 bg-white/5 rounded-xl border border-white/10">
                                        <h3 className="text-lg font-semibold text-indigo-300 border-b border-indigo-500/50 pb-2 mb-3 flex items-center"><FiClipboard className="mr-2"/> Application Questions</h3>
                                        <ul className="list-disc list-inside space-y-2 text-gray-400 ml-4">
                                            {group.applicationForm.map(item => <li key={item._id}>{item.question}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>

                            {/* Conditional Application List (Only for Leader) */}
                            {isLeader && group.status === 'open' && (
                                <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
                                    <ApplicationList groupId={group._id} onAction={() => setRefreshTrigger(p => p + 1)} />
                                </div>
                            )}
                        </div>

                        {/* Right Column: Members, Status, Actions, Chat */}
                        <div className="lg:col-span-1 space-y-8">

                            {/* Members & Actions Card */}
                            <div className="glass-card p-6 rounded-2xl border border-white/10 shadow-xl">
                                <h3 className="text-2xl font-bold text-white mb-4 flex items-center">
                                    <FiUsers className="mr-2 h-6 w-6 text-indigo-400"/> Members ({membersCount}/{memberLimit})
                                </h3>
                                
                                <p className={`text-sm font-medium ${membersRemaining > 0 ? 'text-green-400' : 'text-red-400'} mb-4`}>
                                    <FiTarget className="inline w-4 h-4 mr-1"/> 
                                    {membersRemaining > 0 
                                        ? `Seeking ${membersRemaining} more member(s).` 
                                        : 'Team is at max capacity.'}
                                </p>

                                {/* Member List */}
                                <div className="space-y-3 border-b border-white/10 pb-4 mb-4">
                                    {group.members && group.members
                                        .filter(member => member) 
                                        .map(member => (
                                            <MemberDisplay 
                                                key={member._id} 
                                                member={member} 
                                                groupLeaderId={group.leaderId._id} 
                                            />
                                        ))}
                                </div>
                                
                                {/* Action Buttons */}
                                <div className="mt-4">
                                    {renderActionButtons()}
                                </div>
                            </div>

                            {/* Conditional Chat Window (Only for Members) */}
                            {isMember && group.status === 'open' && (
                                <div className="glass-card p-0 rounded-2xl border border-white/10 shadow-xl overflow-hidden">
                                    <div className="p-4 bg-slate-800 border-b border-white/10">
                                        <h3 className="text-xl font-bold text-green-400 flex items-center">
                                            <FiMessageSquare className="mr-2 h-5 w-5"/> Team Chat
                                        </h3>
                                    </div>
                                    {/* The ChatWindow component itself will render here */}
                                    <ChatWindow groupId={group._id} />
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>

            {/* Modals remain unchanged for functionality */}
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