import React from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiTag } from 'react-icons/fi';

const GroupCard = ({ group }) => {
  if (!group || !group._id) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-200 flex flex-col">
      <div className="p-5 flex-grow">
        <h3 className="text-xl font-bold text-gray-800 truncate">{group.name}</h3>
        <p className="text-sm text-indigo-600 font-semibold">{group.hackathonName}</p>
        
        <p className="text-gray-600 text-sm my-4 h-16 overflow-hidden">
          {group.description?.substring(0, 100) || ''}
          {group.description?.length > 100 && '...'}
        </p>
        
        <div className="flex flex-wrap gap-2">
          <FiTag className="text-gray-500 mt-1"/>
          {(group.tags || []).slice(0, 3).map((tag) => (
            <span key={tag} className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
              {tag}
            </span>
          ))}
           {group.tags?.length > 3 && (
             <span className="px-2 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">
              +{group.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
      
      <div className="border-t border-gray-200 bg-gray-50 p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <FiUsers className="text-gray-500"/>
          <span className="text-sm font-semibold text-gray-700">
            {group.members?.length || 0} / {group.memberLimit} members
          </span>
        </div>
        <Link 
          to={`/groups/${group._id}`} 
          className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};

export default GroupCard;