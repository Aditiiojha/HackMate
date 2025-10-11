import User from '../models/user.model.js';

/**
 * @desc    Upload a new certificate for the authenticated user
 * @route   POST /api/certificates
 * @access  Private
 */
export const uploadCertificate = async (req, res) => {
  try {
    // The 'protect' middleware provides req.user
    // The 'upload' middleware provides req.file if successful
    if (!req.file) {
      return res.status(400).json({ message: 'No file was uploaded.' });
    }

    const { hackathonName, issuedAt } = req.body;
    if (!hackathonName || !issuedAt) {
        return res.status(400).json({ message: 'Hackathon name and issue date are required.' });
    }

    const user = await User.findById(req.user._id);
    if (!user) {
        return res.status(404).json({ message: 'User not found.' });
    }

    // Create the new certificate object based on our schema
    const newCertificate = {
      hackathonName,
      issuedAt,
      fileUrl: req.file.path, // URL from Cloudinary
      cloudinaryId: req.file.filename, // public_id from Cloudinary
    };

    // Add the new certificate to the user's certificates array
    user.certificates.push(newCertificate);
    
    await user.save();

    res.status(201).json(newCertificate);

  } catch (error) {
    console.error('Certificate Upload Error:', error);
    res.status(500).json({ message: 'Server error while uploading certificate.' });
  }
};

/**
 * @desc    Get all certificates for the authenticated user
 * @route   GET /api/certificates
 * @access  Private
 */
export const getMyCertificates = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('certificates');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.status(200).json(user.certificates);
    } catch (error) {
        console.error('Get Certificates Error:', error);
        res.status(500).json({ message: 'Server error while fetching certificates.' });
    }
};