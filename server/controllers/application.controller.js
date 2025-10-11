import Application from '../models/application.model.js';
import Group from '../models/group.model.js';
import mongoose from 'mongoose';

/**
 * @desc    Submit a new application to a group
 * @route   POST /api/applications
 * @access  Private
 */
export const submitApplication = async (req, res) => {
  try {
    const { groupId, answers } = req.body;
    const applicantId = req.user._id;

    // --- Validation ---
    if (!groupId || !answers || !Array.isArray(answers)) {
      return res.status(400).json({ message: 'Invalid application data.' });
    }
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Invalid group ID.' });
    }

    const group = await Group.findById(groupId);
    if (!group) { return res.status(404).json({ message: 'Group not found.' }); }
    if (group.status !== 'open') { return res.status(400).json({ message: 'This group is not accepting applications.' }); }
    if (group.members.includes(applicantId)) { return res.status(400).json({ message: 'You are already a member of this group.' }); }
    if (group.members.length >= group.memberLimit) { return res.status(400).json({ message: 'This group is full.' }); }

    // --- Create Application ---
    const application = new Application({
      groupId,
      applicantId,
      answers: answers.map(a => ({ question: a.question.trim(), answer: a.answer.trim() }))
    });
    await application.save();

    res.status(201).json({ message: 'Application submitted successfully!', applicationId: application._id });
  } catch (error) {
    if (error.code === 11000) { // Handles the unique index violation
      return res.status(400).json({ message: 'You have already applied to this group.' });
    }
    console.error('Submit application error:', error);
    res.status(500).json({ message: 'Server error while submitting application.' });
  }
};

/**
 * @desc    Get all pending applications for a specific group (for leader)
 * @route   GET /api/applications/group/:groupId
 * @access  Private (Leader only)
 */
export const getApplicationsForGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(groupId)) {
      return res.status(400).json({ message: 'Invalid group ID.' });
    }

    const group = await Group.findById(groupId);
    if (!group) { return res.status(404).json({ message: 'Group not found.' }); }

    // Authorization check
    if (group.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the group leader can view applications.' });
    }

    const applications = await Application.find({ groupId, status: 'pending' })
      .populate('applicantId', 'name profilePicture skills') // Populate applicant details
      .sort({ createdAt: -1 });
      
    res.status(200).json(applications);
  } catch (error) {
    console.error('Get applications for group error:', error);
    res.status(500).json({ message: 'Server error while fetching applications.' });
  }
};

/**
 * @desc    Update an application's status (accept/reject)
 * @route   PUT /api/applications/:applicationId
 * @access  Private (Leader only)
 */
export const updateApplicationStatus = async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body; // Expecting 'accepted' or 'rejected'

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status provided.' });
    }

    const application = await Application.findById(applicationId);
    if (!application) { return res.status(404).json({ message: 'Application not found.' }); }

    const group = await Group.findById(application.groupId);
    if (!group) { return res.status(404).json({ message: 'Associated group not found.' }); }

    // Authorization check
    if (group.leaderId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only the group leader can modify applications.' });
    }

    // If accepting, add the user to the group's members list
    if (status === 'accepted') {
      if (group.members.length >= group.memberLimit) {
        return res.status(400).json({ message: 'Cannot accept, group is full.' });
      }
      // Use $addToSet to prevent adding duplicates
      await Group.findByIdAndUpdate(application.groupId, {
        $addToSet: { members: application.applicantId }
      });
    }

    // Update the application's status
    application.status = status;
    await application.save();

    res.status(200).json(application);
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({ message: 'Server error while updating application status.' });
  }
};