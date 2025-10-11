// server/utils/fileUploader.js
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists
const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    const base = path.basename(file.originalname, ext).replace(/\s+/g, '-').toLowerCase();
    cb(null, `${base}-${Date.now()}${ext}`);
  },
});

const fileFilter = (_req, file, cb) => {
  const ok = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
  ok.includes(file.mimetype) ? cb(null, true) : cb(new Error('Unsupported file type'));
};

const baseUpload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

export const singleProfileUpload = (field = 'profilePicture') => (req, res, next) =>
  baseUpload.single(field)(req, res, (err) => {
    if (err) return res.status(400).json({ message: err.message || 'Upload error' });
    if (req.file) req.file.path = `/uploads/${req.file.filename}`; // public URL
    next();
  });

export default baseUpload;
