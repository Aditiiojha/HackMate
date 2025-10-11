import Message from '../models/message.model.js';
import Group from '../models/group.model.js';

/**
 * @desc    Get all historical messages for a group
 * @route   GET /api/chats/:groupId
 * @access  Private (Group members only)
 */
export const getChatHistory = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    // 1. Authorization: Verify the user is a member of the group
    const group = await Group.findById(groupId);
    if (!group) {
        return res.status(404).json({ message: 'Group not found.' });
    }
    if (!group.members.map(id => id.toString()).includes(userId.toString())) {
        return res.status(403).json({ message: 'Not authorized to view this chat history.' });
    }

    // 2. Fetch messages for the group
    const messages = await Message.find({ groupId })
      .sort({ createdAt: 'asc' }) // Sort from oldest to newest
      .populate('senderId', 'name profilePicture'); // Populate sender's info

    res.status(200).json(messages);
  } catch (error) {
    console.error('Get Chat History Error:', error);
    res.status(500).json({ message: 'Server error while fetching chat history.' });
  }
};