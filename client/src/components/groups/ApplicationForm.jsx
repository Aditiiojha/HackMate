import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { FiSend } from 'react-icons/fi';
import { submitApplication } from '../../services/applicationService';

const ApplicationForm = ({ group, onClose, onApplySuccess }) => {
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (group?.applicationForm) {
      setAnswers(group.applicationForm.map(q => ({
        question: q.question,
        answer: ''
      })));
    }
  }, [group]);

  const handleAnswerChange = (index, value) => {
    const newAnswers = [...answers];
    newAnswers[index].answer = value;
    setAnswers(newAnswers);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (answers.some(a => a.answer.trim() === '')) {
      return toast.error('Please answer all application questions.');
    }
    setLoading(true);
    const payload = {
      groupId: group._id,
      answers: answers,
    };
    try {
      await submitApplication(payload);
      toast.success('Application submitted successfully!');
      onApplySuccess();
      onClose();
    } catch (error) {
      toast.error(error.message || 'Failed to submit application.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg">
      <h3 className="text-2xl font-bold text-gray-800 mb-4">Apply to {group.name}</h3>
      <form onSubmit={handleSubmit} className="space-y-6">
        {answers.map((item, index) => (
          <div key={index}>
            <label className="block text-sm font-semibold text-gray-700 mb-1">{item.question}</label>
            <textarea
              value={item.answer}
              onChange={(e) => handleAnswerChange(index, e.target.value)}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              rows="3"
              placeholder="Your answer..."
            />
          </div>
        ))}
        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400"
        >
          <FiSend className="mr-2" />
          {loading ? 'Submitting...' : 'Submit Application'}
        </button>
      </form>
    </div>
  );
};
export default ApplicationForm;