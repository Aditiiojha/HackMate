import express from 'express';
import {
  uploadCertificate,
  getMyCertificates,
} from '../controllers/certificate.controller.js';
import { protect } from '../middleware/auth.middleware.js';
import upload from '../config/cloudinary.js'; // Use the correct upload middleware

const router = express.Router();

// Chain GET and POST requests for the base '/api/certificates' endpoint
router
  .route('/')
  .post(protect, upload.single('certificate'), uploadCertificate)
  .get(protect, getMyCertificates);

export default router;