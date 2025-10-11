import React from 'react';
import GroupForm from '../components/groups/GroupForm';

const CreateGroup = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-900">Start Your Team</h1>
        </div>
        <GroupForm />
      </div>
    </div>
  );
};

export default CreateGroup;