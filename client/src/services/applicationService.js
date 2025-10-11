import API from './api';

/**
 * Submits a new application to a group.
 * @param {Object} applicationData - The application data, including groupId and answers.
 * @returns {Promise<Object>} The newly created application object.
 */
export const submitApplication = async (applicationData) => {
  try {
    const { data } = await API.post('/api/applications', applicationData);
    return data;
  } catch (error) {
    console.error("Error submitting application:", error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to submit application');
  }
};

/**
 * Fetches all pending applications for a specific group. (For group leaders)
 * @param {string} groupId - The ID of the group.
 * @returns {Promise<Array>} An array of application objects.
 */
export const getApplicationsForGroup = async (groupId) => {
  try {
    const { data } = await API.get(`/api/applications/group/${groupId}`);
    return data;
  } catch (error) {
    console.error("Error fetching applications:", error.response?.data || error.message);
    throw error.response?.data || new Error('Failed to fetch applications');
  }
};

/**
 * Updates the status of an application (accept/reject). (For group leaders)
 * @param {string} applicationId - The ID of the application to update.
 * @param {string} status - The new status ('accepted' or 'rejected').
 * @returns {Promise<Object>} The updated application object.
 */
export const updateApplicationStatus = async (applicationId, status) => {
    try {
        const { data } = await API.put(`/api/applications/${applicationId}`, { status });
        return data;
    } catch (error) {
        console.error("Error updating application status:", error.response?.data || error.message);
        throw error.response?.data || new Error('Failed to update status');
    }
};