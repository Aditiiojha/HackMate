import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllGroups } from '../services/groupService';
import GroupCard from '../components/groups/GroupCard';
import toast from 'react-hot-toast';

const PREDEFINED_TAGS = ["AI/ML", "Web Dev", "Mobile Dev", "Blockchain", "AR/VR", "Cybersecurity", "Game Dev", "Cloud"];

const GroupExplorer = () => {
  const [groups, setGroups] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchGroups = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page: currentPage };
      if (selectedTags.length > 0) {
        params.tags = selectedTags;
      }
      const data = await getAllGroups(params);
      setGroups(data.groups || []);
      setPagination(data.pagination);
    } catch (err) {
      setError(err.message || 'Could not fetch groups.');
      toast.error(err.message || 'Could not fetch groups.');
    } finally {
      setLoading(false);
    }
  }, [currentPage, selectedTags]);

  useEffect(() => {
    fetchGroups();
  }, [fetchGroups]);

  const handleTagClick = (tag) => {
    setSelectedTags(prevTags => {
      if (prevTags.includes(tag)) {
        return prevTags.filter(t => t !== tag); // Deselect tag
      } else {
        return [...prevTags, tag]; // Select tag
      }
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  const renderContent = () => {
    if (loading) {
      return <p className="text-center text-gray-500 py-10">Loading teams...</p>;
    }
    if (error) {
      return <p className="text-center text-red-500 py-10">Error: {error}</p>;
    }
    if (!groups || groups.length === 0) {
      return (
        <div className="text-center py-10">
          <h3 className="text-xl font-semibold text-gray-700">No Teams Found</h3>
          <p className="text-gray-500 mt-2">Try adjusting your filters or be the first to create a team!</p>
          <Link to="/create-group" className="mt-4 inline-block px-6 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700">
            Create a Team
          </Link>
        </div>
      );
    }
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <GroupCard key={group._id} group={group} />
        ))}
      </div>
    );
  };

  const PaginationControls = () => (
    <div className="flex justify-center items-center mt-8 space-x-4">
      <button
        onClick={() => setCurrentPage(p => p - 1)}
        disabled={!pagination?.hasPrevPage}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Previous
      </button>
      <span className="text-sm text-gray-700">
        Page {pagination?.currentPage} of {pagination?.totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(p => p + 1)}
        disabled={!pagination?.hasNextPage}
        className="px-4 py-2 bg-white border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Find a Team</h1>

        <div className="mb-6 p-4 bg-white rounded-md shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Tags:</label>
          <div className="flex flex-wrap gap-2">
            {PREDEFINED_TAGS.map(tag => (
              <button
                key={tag}
                onClick={() => handleTagClick(tag)}
                className={`px-3 py-1 text-sm font-semibold rounded-full border-2 transition-colors ${
                  selectedTags.includes(tag)
                    ? 'bg-indigo-600 text-white border-indigo-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-indigo-500'
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>

        {renderContent()}
        {pagination && pagination.totalPages > 1 && <PaginationControls />}
      </div>
    </div>
  );
};

export default GroupExplorer;