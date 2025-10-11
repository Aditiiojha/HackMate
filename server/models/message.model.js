import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true, // Index for faster lookups of a user's messages
  },
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true,
    index: true, // Index for faster lookups of a group's messages
  },
  content: {
    type: String,
    required: true,
    trim: true,
    maxLength: 2000, // Prevent extremely long messages
  },
  contentType: {
    type: String,
    enum: ['text', 'media', 'notification'],
    default: 'text',
  },
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
});

// A compound index is a major performance optimization for chat applications.
// It allows the database to efficiently find all messages for a group
// and sort them by creation date in a single, fast operation.
messageSchema.index({ groupId: 1, createdAt: -1 });

const Message = mongoose.model('Message', messageSchema);

export default Message;