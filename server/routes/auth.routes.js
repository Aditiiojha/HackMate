import express from 'express';
import { register, me } from '../controllers/auth.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();
router.post('/register', register);
router.get('/me', protect, me);
export default router;
