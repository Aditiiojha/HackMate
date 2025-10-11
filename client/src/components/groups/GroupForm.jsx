import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiPlusCircle, FiX } from 'react-icons/fi';
import { createGroup } from '../../services/groupService';

const PREDEFINED_TAGS = ["AI/ML", "Web Dev", "Mobile Dev", "Blockchain", "AR/VR", "Cybersecurity", "Game Dev", "Cloud"];

const GroupForm = () => {
  const [groupData, setGroupData] = useState({
    name: '',
    hackathonName: '',
    description: '',
    memberLimit: 4,
  });
  const [tags, setTags] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setGroupData({ ...groupData, [name]: value });
  };

  const handleTagToggle = (tag) => {
    setTags(prevTags =>
      prevTags.includes(tag)
        ? prevTags.filter(t => t !== tag)
        : [...prevTags, tag]
    );
  };

  const handleAddQuestion = () => {
    if (currentQuestion.trim() && !questions.includes(currentQuestion.trim())) {
      setQuestions([...questions, currentQuestion.trim()]);
      setCurrentQuestion('');
    }
  };

  const handleRemoveQuestion = (index) => {
    setQuestions(questions.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (tags.length === 0) {
        return toast.error("Please select at least one domain tag.");
    }
    setLoading(true);
    const payload = { ...groupData, tags, applicationForm: questions.map(q => ({ question: q })) };
    
    try {
        // The 'await' keyword here is the crucial fix.
        // It ensures the code waits for the server's response.
        const newGroup = await createGroup(payload);
        
        toast.success('Group created successfully!');
        navigate(`/groups/${newGroup._id}`); // Navigate to the new group's page
    } catch (error) {
        toast.error(error.message || 'Failed to create group.');
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Create a New Hackathon Team</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <input type="text" name="name" placeholder="Team Name" value={groupData.name} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md" />
        <input type="text" name="hackathonName" placeholder="Hackathon/Event Name" value={groupData.hackathonName} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md" />
        <textarea name="description" placeholder="Team Description & Goals" value={groupData.description} onChange={handleInputChange} required className="w-full px-4 py-2 border rounded-md" rows="4" />
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Team Size (including you)</label>
            <select name="memberLimit" value={groupData.memberLimit} onChange={handleInputChange} className="w-full mt-1 px-4 py-2 border rounded-md">
                {[2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num} members</option>)}
            </select>
        </div>

        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Domain Tags</label>
            <div className="flex flex-wrap gap-2">
                {PREDEFINED_TAGS.map(tag => (
                    <button type="button" key={tag} onClick={() => handleTagToggle(tag)}
                        className={`px-3 py-1 text-sm rounded-full transition-colors ${tags.includes(tag) ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
                        {tag}
                    </button>
                ))}
            </div>
        </div>
        
        <div>
            <label className="block text-sm font-medium text-gray-700">Custom Application Questions (Optional)</label>
            <div className="flex items-center mt-2">
                <input type="text" value={currentQuestion} onChange={(e) => setCurrentQuestion(e.target.value)} placeholder="e.g., What's your GitHub?" className="flex-grow px-4 py-2 border rounded-l-md" />
                <button type="button" onClick={handleAddQuestion} className="px-4 py-2 bg-indigo-500 text-white rounded-r-md"><FiPlusCircle/></button>
            </div>
            <ul className="mt-2 space-y-1">
                {questions.map((q, index) => (
                    <li key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded-md text-sm">
                        <span>{q}</span>
                        <button type="button" onClick={() => handleRemoveQuestion(index)} className="text-red-500 hover:text-red-700"><FiX/></button>
                    </li>
                ))}
            </ul>
        </div>
        
        <button type="submit" disabled={loading} className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400">
            {loading ? 'Creating Group...' : 'Create Group'}
        </button>
      </form>
    </div>
  );
};

export default GroupForm;