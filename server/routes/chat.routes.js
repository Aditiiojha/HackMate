import express from 'express';
import { getChatHistory } from '../controllers/chat.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// All chat history routes are private and require the user to be a group member.
router.use(protect);

// Route for a user to get the chat history for a specific group
router.route('/:groupId').get(getChatHistory);

export default router;