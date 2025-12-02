import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    uid: { type: String, required: true, unique: true, index: true },  // Firebase UID
    name: { type: String, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, index: true },
    password: { type: String, select: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    profilePicture: { type: String, default: 'https://i.imgur.com/6VBx3io.png' },
    profilePicturePublicId: { type: String },
    bio: { type: String, default: '' },
    year: { type: String, default: '' },
    skills: { type: [String], default: [] },
    hackathonHistory: {
      type: [{ hackathonName: String, teamName: String, outcome: String }],
      default: []
    },
   
    certificates: { 
      type: [{ 
        hackathonName: String,
        issuedAt: Date,
        fileUrl: String,
        cloudinaryId: String,
      }],
      default: []
    }
   
  },
  { timestamps: true }
);

const User = mongoose.models.User || mongoose.model('User', userSchema);
export default User;
