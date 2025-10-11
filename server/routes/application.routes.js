import express from 'express';
import {
  submitApplication,
  getApplicationsForGroup,
  updateApplicationStatus
} from '../controllers/application.controller.js';
import { protect as verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

// Protect all application routes
router.use(verifyToken);

// POST /api/applications -> Submit a new application to a group
router.post('/', submitApplication);

// GET /api/applications/group/:groupId -> Get all applications for a specific group (for the leader)
router.get('/group/:groupId', getApplicationsForGroup);

// PUT /api/applications/:applicationId -> Update an application's status (accept/reject)
router.put('/:applicationId', updateApplicationStatus);

export default router;