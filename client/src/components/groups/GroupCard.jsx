import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiTag, FiLock, FiUnlock, FiMapPin } from 'react-icons/fi';

const GroupCard = ({ group }) => {
  if (!group || !group._id) {
    return null;
  }

  const isFull = group.members?.length >= group.memberLimit;
  const statusText = isFull ? 'Closed (Full)' : 'Open';
  const statusColor = isFull ? 'text-red-400' : 'text-green-400';
  const statusIcon = isFull ? <FiLock /> : <FiUnlock />;

  // Function to render placeholder/mock avatars (assuming user has an avatar URL field)
  const renderAvatars = () => {
    const membersToShow = (group.members || []).slice(0, 4);
    return (
      <div className="flex -space-x-2 overflow-hidden">
        {membersToShow.map((member, index) => (
          // Use a simple placeholder circle since we don't have real avatar URLs
          <div key={member._id || index} 
              className={`inline-block w-8 h-8 rounded-full ring-2 ring-slate-800 bg-gray-500 flex items-center justify-center text-xs font-bold text-white shadow-lg`}
              style={{ zIndex: membersToShow.length - index }}>
            {member.initials || 'A'}
          </div>
        ))}
        {group.members?.length > 4 && (
          <span className="flex items-center justify-center w-8 h-8 text-xs font-medium text-white bg-indigo-600 rounded-full ring-2 ring-slate-800 shadow-lg">
            +{group.members.length - 4}
          </span>
        )}
      </div>
    );
  };

  return (
    <div className="group glass-card p-6 rounded-2xl flex flex-col h-full 
                      transform transition-all duration-300 ease-in-out 
                      hover:scale-[1.03] hover:shadow-indigo-500/30 hover:shadow-2xl">
      
      <div className="flex-grow">
        
        {/* Team Name & Hackathon */}
        <h3 className="text-2xl font-extrabold text-white truncate group-hover:text-indigo-300 transition-colors duration-300 mb-1">
          {group.name}
        </h3>
        <p className="text-sm font-semibold text-indigo-400 flex items-center mb-4">
          <FiMapPin className="mr-1 h-4 w-4"/> {group.hackathonName}
        </p>
        
        {/* Status and Members Count */}
        <div className="flex items-center justify-between text-sm mb-4">
          <span className={`flex items-center font-bold ${statusColor} `}>
            {statusIcon}
            <span className="ml-1">{statusText}</span>
          </span>
          <span className="flex items-center text-gray-400 font-medium">
            <FiUsers className="mr-1 h-4 w-4"/> {group.members?.length || 0} / {group.memberLimit}
          </span>
        </div>

        {/* Description (Truncated) */}
        <p className="text-gray-300 text-sm my-4 h-12 overflow-hidden line-clamp-2">
          {group.description?.substring(0, 100) || 'No description provided.'}
          {group.description?.length > 100 && '...'}
        </p>
        
        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-6">
          {(group.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-0.5 text-xs font-semibold text-indigo-300 bg-white/5 rounded-full border border-indigo-400/50 hover:bg-white/10 transition">
              {tag}
            </span>
          ))}
            {group.tags?.length > 3 && (
              <span className="px-2 py-0.5 text-xs font-semibold text-gray-400 bg-white/5 rounded-full">
              +{group.tags.length - 3}
            </span>
          )}
        </div>
      </div>
      
      {/* Footer: Avatars and CTA Button */}
      <div className="pt-4 border-t border-white/10 flex justify-between items-center mt-auto">
        {/* Avatars */}
        {renderAvatars()}
        
        {/* CTA Button (Secondary Glow Style) */}
        <Link 
          to={`/groups/${group._id}`} 
          className="px-5 py-2 text-sm font-medium rounded-xl 
                                 bg-white/10 text-indigo-300 border border-indigo-400/50 
                                 hover:bg-white/20 hover:text-white transition-all duration-300 
                                 shadow-lg shadow-indigo-500/10 hover:shadow-indigo-500/30"
        >
          View / Apply
        </Link>
      </div>
      
    </div>
  );
};

export default GroupCard;