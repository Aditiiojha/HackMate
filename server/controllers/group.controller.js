import Group from '../models/group.model.js';
import User from '../models/user.model.js';
import mongoose from 'mongoose';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

// Rate limiting middleware
export const createGroupLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 create group requests per window
    message: 'Too many groups created from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});

// Validation middleware
export const validateGroupCreation = [
    body('name', 'Group name must be between 3 and 50 characters').trim().isLength({ min: 3, max: 50 }),
    body('hackathonName', 'Hackathon name is required').trim().notEmpty(),
    body('memberLimit', 'Member limit must be between 2 and 10').isInt({ min: 2, max: 10 }),
    body('description', 'Description cannot be more than 500 characters').optional().isLength({ max: 500 }),
];

export const validateGroupUpdate = [
    body('name', 'Group name must be between 3 and 50 characters').optional().trim().isLength({ min: 3, max: 50 }),
    body('description', 'Description cannot be more than 500 characters').optional().isLength({ max: 500 }),
];


// --- CONTROLLER FUNCTIONS ---

export const createGroup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { name, hackathonName, description, memberLimit, tags, applicationForm } = req.body;
        const leaderId = req.user._id;
        const newGroup = await Group.create({ name, hackathonName, description, memberLimit, tags, applicationForm, leaderId, members: [leaderId] });
        const safeGroup = {
            ...newGroup.toObject(),
            _id: newGroup._id.toString(),
        };
        res.status(201).json(safeGroup);
    } catch (error) {
        console.error('Group Creation Error:', error);
        res.status(500).json({ message: 'Server error during group creation.' });
    }
};

export const getAllGroups = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { status: 'open' };
    if (req.query.hackathonName) {
        filter.hackathonName = { $regex: req.query.hackathonName, $options: 'i' };
    }
    if (req.query.tags && req.query.tags.length > 0) {
        const tagsArray = Array.isArray(req.query.tags) ? req.query.tags : [req.query.tags];
        filter.tags = { $in: tagsArray };
    }

    const [groups, total] = await Promise.all([
        Group.find(filter)
            .populate('leaderId', 'name profilePicture')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .lean(),
        Group.countDocuments(filter)
    ]);

    res.status(200).json({
        groups,
        pagination: { 
            currentPage: page, 
            totalPages: Math.ceil(total / limit), 
            totalGroups: total 
        }
    });
  } catch(error){
    console.error('Get All Groups Error:', error);
    res.status(500).json({ message: 'Server error while fetching groups.' });
  }
};

export const getGroupById = async (req, res) => {
    try {
        const { groupId } = req.params;
        if (!mongoose.Types.ObjectId.isValid(groupId)) {
            return res.status(400).json({ message: 'Invalid group ID format.' });
        }
        const group = await Group.findById(groupId).populate('leaderId', 'name profilePicture email').populate('members', 'name profilePicture skills').lean();
        if (!group) { return res.status(404).json({ message: 'Group not found.' }); }
        res.status(200).json(group);
    } catch (error) {
        console.error('Get Group By ID Error:', error);
        res.status(500).json({ message: 'Server error while fetching group details.' });
    }
};

export const updateGroup = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId);
        if (!group) { return res.status(404).json({ message: 'Group not found.' }); }
        if (group.leaderId.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Only the group leader can update the group.' });
        }
        const updates = req.body;
        const updatedGroup = await Group.findByIdAndUpdate(groupId, updates, { new: true, runValidators: true }).lean();
        res.status(200).json(updatedGroup);
    } catch (error) {
        console.error('Update Group Error:', error);
        res.status(500).json({ message: 'Server error while updating group.' });
    }
};

export const disbandGroup = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { groupId } = req.params;
        const group = await Group.findById(groupId).session(session);
        if (!group) { await session.endSession(); return res.status(404).json({ message: 'Group not found.' }); }
        if (group.leaderId.toString() !== req.user._id.toString()) {
            await session.endSession();
            return res.status(403).json({ message: 'Only the group leader can disband the group.' });
        }
        const historyEntry = { hackathonName: group.hackathonName, teamName: group.name, outcome: req.body.outcome || 'Participant' };
        await User.updateMany({ _id: { $in: group.members } }, { $push: { hackathonHistory: historyEntry } }, { session });
        group.status = 'disbanded';
        await group.save({ session });
        await session.commitTransaction();
        res.status(200).json({ message: 'Group successfully disbanded.' });
    } catch (error) {
        await session.abortTransaction();
        console.error('Disband Group Error:', error);
        res.status(500).json({ message: 'Server error while disbanding group.' });
    } finally {
        session.endSession();
    }
};

export const getUserGroups = async (req, res) => {
    try {
        const userId = req.user._id;
        const status = req.query.status || 'open';
        const groups = await Group.find({ members: userId, status: status }).populate('leaderId', 'name profilePicture').sort({ createdAt: -1 }).lean();
        res.status(200).json(groups);
    } catch (error) {
        console.error('Get User Groups Error:', error);
        res.status(500).json({ message: 'Server error while fetching user groups.' });
    }
};

export const joinGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;
        
        const group = await Group.findById(groupId);
        if (!group) { return res.status(404).json({ message: 'Group not found.' }); }
        
        if (group.status !== 'open') { return res.status(400).json({ message: 'Group is not accepting new members.' }); }
        if (group.members.includes(userId)) { return res.status(400).json({ message: 'You are already a member of this group.' }); }
        if (group.members.length >= group.memberLimit) { return res.status(400).json({ message: 'Group has reached its member limit.' }); }

        group.members.push(userId);
        await group.save();
        
        const updatedGroup = await Group.findById(groupId).populate('leaderId', 'name profilePicture').populate('members', 'name profilePicture');
        res.status(200).json({ message: 'Successfully joined the group.', group: updatedGroup });
    } catch (error) {
        console.error('Join Group Error:', error);
        res.status(500).json({ message: 'Server error while joining group.' });
    }
};

export const leaveGroup = async (req, res) => {
    try {
        const { groupId } = req.params;
        const userId = req.user._id;

        const group = await Group.findById(groupId);
        if (!group) { return res.status(404).json({ message: 'Group not found.' }); }

        if (!group.members.includes(userId)) { return res.status(400).json({ message: 'You are not a member of this group.' }); }
        
        if (group.leaderId.toString() === userId.toString()) {
            return res.status(400).json({ message: 'Group leader cannot leave. Transfer leadership or disband the group.' });
        }
        
        group.members = group.members.filter(memberId => memberId.toString() !== userId.toString());
        await group.save();
        
        res.status(200).json({ message: 'Successfully left the group.' });
    } catch (error) {
        console.error('Leave Group Error:', error);
        res.status(500).json({ message: 'Server error while leaving group.' });
    }
};