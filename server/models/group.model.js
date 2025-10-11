import mongoose from 'mongoose';

// A sub-schema for the custom questions in the application form
const applicationFormSchema = new mongoose.Schema({
    question: { 
        type: String, 
        required: true,
        trim: true 
    },
});

const groupSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        trim: true 
    },
    hackathonName: { 
        type: String, 
        required: true, 
        trim: true 
    },
    description: { 
        type: String, 
        required: true, 
        maxLength: 1000 
    },
    tags: [{ 
        type: String, 
        required: true 
    }],
    leaderId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    members: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User' 
    }],
    memberLimit: { 
        type: Number, 
        default: 4, 
        min: 2, 
        max: 6 
    },
    visibility: { 
        type: String, 
        enum: ['Public', 'College-only'], 
        default: 'Public' 
    },
    applicationForm: [applicationFormSchema],
    status: { 
        type: String, 
        enum: ['open', 'locked', 'disbanded'], 
        default: 'open' 
    }
}, { 
    timestamps: true 
});

const Group = mongoose.model('Group', groupSchema);
export default Group;