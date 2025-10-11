import API from './api';

/**
 * Creates a new group.
 * @param {Object} groupData - The data for the new group.
 * @returns {Promise<Object>} The newly created group object from the server.
 */
export const createGroup = async (groupData) => {
  try {
    const { data } = await API.post('/api/groups', groupData);
    return data;
  } catch (error) {
    console.error("Error creating group:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to create group');
  }
};

/**
 * Fetches all groups, with optional filters and pagination.
 * @param {Object} params - Optional query parameters like { page: 1, tags: ['AI'] }.
 * @returns {Promise<Object>} An object containing the groups array and pagination info.
 */
export const getAllGroups = async (params = {}) => {
    try {
        const { data } = await API.get('/api/groups', { params });
        return data;
    } catch (error) {
        console.error("Error fetching groups:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch groups');
    }
};

/**
 * Fetches a single group by its ID, with cache-busting.
 * @param {string} groupId - The ID of the group to fetch.
 * @param {Object} params - Optional query parameters like { t: Date.now() } to prevent caching.
 * @returns {Promise<Object>} The group object.
 */
export const getGroupById = async (groupId, params = {}) => {
    try {
        const { data } = await API.get(`/api/groups/${groupId}`, {
            params: params,
            headers: { 'Cache-Control': 'no-cache' },
        });
        return data;
    } catch (error) {
        console.error(`Error fetching group ${groupId}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to fetch group');
    }
};

/**
 * Updates an existing group's details.
 * @param {string} groupId - The ID of the group to update.
 * @param {Object} updateData - An object with the fields to update.
 * @returns {Promise<Object>} The updated group object.
 */
export const updateGroup = async (groupId, updateData) => {
    try {
        const { data } = await API.put(`/api/groups/${groupId}`, updateData);
        return data;
    } catch (error) {
        console.error(`Error updating group ${groupId}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to update group');
    }
};

/**
 * Disbands a group, creating hackathon history for its members.
 * @param {string} groupId - The ID of the group to disband.
 * @param {string} outcome - The outcome of the hackathon (e.g., 'Winner').
 * @returns {Promise<Object>} The success message from the server.
 */
export const disbandGroup = async (groupId, outcome) => {
    try {
        const { data } = await API.put(`/api/groups/${groupId}/disband`, { outcome });
        return data;
    } catch (error) {
        console.error(`Error disbanding group ${groupId}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to disband group');
    }
};

/**
 * Fetches all groups that the currently authenticated user is a member of.
 * @returns {Promise<Array>} An array of the user's group objects.
 */
export const getMyGroups = async () => {
    try {
        const { data } = await API.get('/api/groups/my-groups');
        return data;
    } catch (error) {
        console.error("Error fetching user's groups:", error.response?.data || error.message);
        throw new Error(error.response?.data?.message || "Failed to fetch user's groups");
    }
};

/**
 * Allows a user to join a group.
 * @param {string} groupId - The ID of the group to join.
 * @returns {Promise<Object>} The success message and updated group.
 */
export const joinGroup = async (groupId) => {
    try {
        const { data } = await API.post(`/api/groups/${groupId}/join`);
        return data;
    } catch (error) {
        console.error(`Error joining group ${groupId}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to join group');
    }
};

/**
 * Allows a user to leave a group.
 * @param {string} groupId - The ID of the group to leave.
 * @returns {Promise<Object>} The success message.
 */
export const leaveGroup = async (groupId) => {
    try {
        const { data } = await API.post(`/api/groups/${groupId}/leave`);
        return data;
    } catch (error) {
        console.error(`Error leaving group ${groupId}:`, error.response?.data || error.message);
        throw new Error(error.response?.data?.message || 'Failed to leave group');
    }
};