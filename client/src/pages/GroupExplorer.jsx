import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { getAllGroups } from '../services/groupService';
import GroupCard from '../components/groups/GroupCard';
import toast from 'react-hot-toast';
import { FiSearch, FiFrown, FiChevronLeft, FiChevronRight, FiPlusCircle } from 'react-icons/fi';

// NOTE: Retained the original predefined tags and service calls for compatibility.
const PREDEFINED_TAGS = ["AI/ML", "Web Dev", "Mobile Dev", "Blockchain", "AR/VR", "Cybersecurity", "Game Dev", "Cloud"];

// --- New Skeleton Card Component for Loading State ---
const SkeletonCard = () => (
  <div className="glass-card p-6 rounded-2xl animate-pulse h-64">
    <div className="h-4 bg-slate-700 rounded w-3/4 mb-3"></div>
    <div className="h-3 bg-slate-700 rounded w-1/2 mb-6"></div>
    <div className="h-12 bg-slate-700 rounded mb-4"></div>
    <div className="flex flex-wrap gap-2 mb-6">
      <div className="h-5 bg-slate-700 rounded-full w-16"></div>
      <div className="h-5 bg-slate-700 rounded-full w-12"></div>
    </div>
    <div className="h-8 bg-indigo-500/20 rounded-xl w-full"></div>
  </div>
);

const GroupExplorer = () => {
  const [groups, setGroups] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTags, setSelectedTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isInitialLoad, setIsInitialLoad] = useState(true);

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
      setError(null);
    } catch (err) {
      setError(err.message || 'Could not fetch groups.');
      toast.error(err.message || 'Could not fetch groups.');
    } finally {
      setLoading(false);
      setIsInitialLoad(false);
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
      // Show 6 skeleton cards while loading
      return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => <SkeletonCard key={i} />)}
        </div>
      );
    }
    if (error) {
      return (
        <div className="text-center py-20 glass-card rounded-2xl mt-8">
          <FiFrown className="mx-auto h-12 w-12 text-red-400" />
          <h3 className="mt-2 text-xl font-semibold text-red-300">Connection Error</h3>
          <p className="mt-1 text-red-200">Something went wrong while fetching teams: {error}</p>
        </div>
      );
    }
    if (!groups || groups.length === 0) {
      return (
        // Nice illustrated empty state
        <div className="text-center py-20 glass-card rounded-2xl mt-8">
          <FiSearch className="mx-auto h-12 w-12 text-indigo-400" />
          <h3 className="mt-2 text-xl font-semibold text-white">No Teams Found</h3>
          <p className="text-gray-300 mt-1">Try adjusting your filters or be the first to create a team!</p>
          <Link to="/create-group" className="btn-neon-primary mt-6 inline-flex items-center space-x-2">
            <FiPlusCircle/> <span>Create a Team</span>
          </Link>
        </div>
      );
    }
    
    // Render group cards with a staggered fade-in effect
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group, index) => (
          <div key={group._id} 
              className={`transition-all duration-700 ${isInitialLoad ? 'opacity-0 translate-y-4' : 'opacity-100 translate-y-0'}`} 
              style={{ transitionDelay: `${index * 50}ms` }}>
            <GroupCard group={group} />
          </div>
        ))}
      </div>
    );
  };

  const PaginationControls = () => (
    <div className="flex justify-center items-center mt-12 space-x-3">
      <button
        onClick={() => setCurrentPage(p => p - 1)}
        disabled={!pagination?.hasPrevPage}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-white/5 hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-white/5"
      >
        <FiChevronLeft className="w-5 h-5"/>
      </button>
      <span className="text-sm font-semibold text-gray-300 px-4">
        Page {pagination?.currentPage} of {pagination?.totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(p => p + 1)}
        disabled={!pagination?.hasNextPage}
        className="w-10 h-10 flex items-center justify-center rounded-full text-white bg-white/5 hover:bg-white/10 transition disabled:opacity-30 disabled:hover:bg-white/5"
      >
        <FiChevronRight className="w-5 h-5"/>
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pt-4 pb-12">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-8 text-neon-glow">
          Explore Hack Teams
        </h1>

        {/* Sticky Filter Panel (Glassmorphism) */}
        <div className="sticky top-[72px] z-20 mb-10 p-4 md:p-5 glass-card rounded-2xl shadow-2xl">
          <label className="block text-lg font-semibold text-indigo-300 mb-3">Filter by Key Technologies:</label>
          <div
            className="flex flex-wrap gap-2 md:gap-3 max-h-32 overflow-y-auto pr-2"
          >
            {PREDEFINED_TAGS.map(tag => {
              const isActive = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => handleTagClick(tag)}
                  className={`
                    px-4 py-1 text-sm font-semibold rounded-full border transition-all duration-300 ease-in-out whitespace-nowrap
                    ${isActive 
                      ? 'filter-pill-active border-indigo-500' 
                      : 'bg-white/5 text-gray-300 border-white/10 hover:border-indigo-400 hover:text-white'
                    }
                  `}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Grid */}
        {renderContent()}
        
        {/* Pagination */}
        {pagination && pagination.totalPages > 1 && <PaginationControls />}
      </div>
    </div>
  );
};

export default GroupExplorer;