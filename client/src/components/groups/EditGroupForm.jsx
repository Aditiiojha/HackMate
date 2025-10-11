import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
// We will create the updateGroup function in the next step
// import { updateGroup } from '../../services/groupService';

const EditGroupForm = ({ group, onUpdateSuccess, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    tags: [],
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Pre-fill the form with the current group's data
    if (group) {
      setFormData({
        name: group.name,
        description: group.description,
        tags: group.tags,
      });
    }
  }, [group]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // This service function will be created next
      // const updatedGroup = await updateGroup(group._id, formData);
      toast.success('Group updated successfully!');
      onUpdateSuccess(); // Tell the parent page to refresh its data
      onClose(); // Close the modal
    } catch (error) {
      toast.error(error.message || 'Failed to update group.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-2">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Team Name</label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            id="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
            required
          />
        </div>
        <div className="flex justify-end space-x-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
                Cancel
            </button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
                {loading ? 'Saving...' : 'Save Changes'}
            </button>
        </div>
      </form>
    </div>
  );
};

export default EditGroupForm;