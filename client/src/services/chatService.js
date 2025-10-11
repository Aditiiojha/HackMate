import API from './api';

/**
 * Fetches the chat history for a specific group.
 * @param {string} groupId - The ID of the group.
 * @returns {Promise<Array>} An array of message objects.
 */
export const getChatHistory = async (groupId) => {
  try {
    const { data } = await API.get(`/api/chats/${groupId}`);
    return data;
  } catch (error) {
    console.error(`Error fetching chat history for group ${groupId}:`, error.response?.data || error.message);
    throw new Error(error.response?.data?.message || 'Failed to fetch chat history');
  }
};