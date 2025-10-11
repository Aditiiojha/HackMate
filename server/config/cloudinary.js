import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import dotenv from 'dotenv';

dotenv.config();

// Configure the Cloudinary SDK with your credentials from .env
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

// Set up the storage engine for Multer
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'HackMate/profile_pictures', // Use a specific folder for profile pics
    allowed_formats: ['jpg', 'png', 'jpeg'],
    // Transformation to create a square, high-quality avatar
    transformation: [{ width: 500, height: 500, crop: 'fill', gravity: 'face' }],
    public_id: (req, file) => `avatar-${req.user._id}-${Date.now()}`,
  },
});

// Create the Multer upload instance using the configured storage
const upload = multer({ storage: storage });

export default upload;