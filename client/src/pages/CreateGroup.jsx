import React from 'react';
import GroupForm from '../components/groups/GroupForm';
import { FiZap } from 'react-icons/fi';

const CreateGroup = () => {
  return (
    // Update background to dark slate for the cyberpunk aesthetic
    <div className="min-h-screen pt-4 pb-12 bg-slate-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Section with Neon Glow Title */}
        <header className="py-10 mb-8">
            <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight text-neon-glow-small">
                Start Your Team
            </h1>
            <p className="text-xl text-gray-300 mt-2">Define your vision, skills, and team size.</p>
        </header>

        {/* GroupForm Component now contains the styled glass form */}
        <GroupForm /> 

      </div>
    </div>
  );
};

export default CreateGroup;