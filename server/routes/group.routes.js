import express from 'express';
import {
  createGroup,
  getAllGroups,
  getGroupById,
  updateGroup,
  disbandGroup,
  joinGroup,
  leaveGroup,
  getUserGroups,
  createGroupLimiter,
  validateGroupCreation,
  validateGroupUpdate,
} from '../controllers/group.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// Route to get all groups a specific user is part of
router.get('/my-groups', protect, getUserGroups);

// Base route for creating and listing all groups
router
  .route('/')
  .post(protect, createGroupLimiter, validateGroupCreation, createGroup)
  .get(getAllGroups);

// Routes for a specific group by its ID
router
  .route('/:groupId')
  .get(getGroupById)
  .put(protect, validateGroupUpdate, updateGroup);

// Route for a user to join a group
router.post('/:groupId/join', protect, joinGroup);

// Route for a user to leave a group
router.post('/:groupId/leave', protect, leaveGroup);

// Route for a group leader to disband their group
router.put('/:groupId/disband', protect, disbandGroup);

export default router;