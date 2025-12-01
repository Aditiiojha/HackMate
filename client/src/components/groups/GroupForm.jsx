import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
    FiPlusCircle, 
    FiX, 
    FiUsers, 
    FiTarget, 
    FiHash, 
    FiFileText, 
    FiCheck, 
    FiCode, 
    FiScissors 
} from 'react-icons/fi';
import { createGroup } from '../../services/groupService';

const PREDEFINED_TAGS = ["AI/ML", "Web Dev", "Mobile Dev", "Blockchain", "AR/VR", "Cybersecurity", "Game Dev", "Cloud"];

// --- Custom Form UI Components (to apply consistent styling) ---

const FormInput = ({ label, name, type = 'text', icon: Icon, placeholder, required = false, value, onChange, children }) => (
    <div className="mb-6">
        <label className="block text-sm font-semibold text-gray-300 mb-2 flex items-center">
            {Icon && <Icon className="w-4 h-4 mr-2 text-indigo-400" />} {label} {required && <span className="text-red-400 ml-1">*</span>}
        </label>
        {type === 'select' ? (
            <select name={name} value={value} onChange={onChange} className="w-full mt-1 px-4 py-3 bg-white/5 text-white border border-white/10 rounded-lg focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 appearance-none">
                {children}
            </select>
        ) : type === 'textarea' ? (
            <textarea name={name} placeholder={placeholder} value={value} onChange={onChange} required={required} rows="4" className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-lg shadow-inner transition duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 resize-none" />
        ) : (
            <input 
                type={type} 
                name={name} 
                placeholder={placeholder} 
                value={value} 
                onChange={onChange} 
                required={required} 
                className="w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-lg shadow-inner transition duration-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500" 
            />
        )}
    </div>
);

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
            const newGroup = await createGroup(payload);
            
            toast.success('Group created successfully!');
            navigate(`/groups/${newGroup._id}`); 
        } catch (error) {
            toast.error(error.message || 'Failed to create group.');
        } finally {
            setLoading(false);
        }
    };

    return (
        // Apply Glassmorphism card styling
        <div className="max-w-4xl mx-auto glass-card p-8 rounded-2xl border border-white/10 shadow-2xl">
            <h2 className="text-3xl font-bold text-indigo-400 mb-8 flex items-center">
                <FiPlusCircle className="mr-3"/> Create a New Hackathon Team
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                {/* Team Name */}
                <FormInput 
                    label="Team Name" 
                    name="name" 
                    icon={FiUsers} 
                    placeholder="e.g., The Code Ninjas" 
                    value={groupData.name} 
                    onChange={handleInputChange} 
                    required 
                />

                {/* Hackathon/Event Name */}
                <FormInput 
                    label="Hackathon/Event Name" 
                    name="hackathonName" 
                    icon={FiHash} 
                    placeholder="e.g., Silicon Valley Hackathon" 
                    value={groupData.hackathonName} 
                    onChange={handleInputChange} 
                    required 
                />

                {/* Team Description & Goals (Textarea) */}
                <FormInput 
                    label="Team Description & Goals" 
                    name="description" 
                    icon={FiTarget} 
                    placeholder="What problem will you solve? What skills are you looking for?" 
                    value={groupData.description} 
                    onChange={handleInputChange} 
                    required 
                    type="textarea"
                />

                {/* Team Size (Select) */}
                <div className="flex items-center space-x-2">
                    <FiUsers className="w-4 h-4 text-indigo-400"/>
                    <FormInput 
                        label="Team Size (including you)"
                        name="memberLimit"
                        value={groupData.memberLimit}
                        onChange={handleInputChange}
                        type="select"
                    >
                        {[2, 3, 4, 5, 6].map(num => <option key={num} value={num}>{num} members</option>)}
                    </FormInput>
                </div>

                {/* Domain Tags */}
                <div>
                    <label className="block text-sm font-semibold text-gray-300 mb-3 flex items-center">
                        <FiCode className="w-4 h-4 mr-2 text-indigo-400"/> Domain Tags
                    </label>
                    <div className="flex flex-wrap gap-2">
                        {PREDEFINED_TAGS.map(tag => (
                            <button type="button" key={tag} onClick={() => handleTagToggle(tag)}
                                className={`px-4 py-1 text-sm font-semibold rounded-full border transition-all duration-300 ease-in-out whitespace-nowrap
                                    ${tags.includes(tag) 
                                        ? 'bg-indigo-600 text-white border-indigo-500 shadow-md shadow-indigo-500/50' 
                                        : 'bg-white/5 text-gray-300 border-white/10 hover:border-indigo-400 hover:text-white'
                                    }`}>
                                {tags.includes(tag) && <FiCheck className="inline mr-1 w-4 h-4"/>} {tag}
                            </button>
                        ))}
                    </div>
                </div>
                
                {/* Custom Application Questions */}
                <div className="p-6 bg-white/5 rounded-xl border border-white/10">
                    <label className="block text-xl font-bold text-indigo-300 mb-4 border-b border-indigo-500/50 pb-2 flex items-center">
                        <FiFileText className="mr-2"/> Custom Application Questions (Optional)
                    </label>
                    
                    <ul className="mt-2 space-y-2 mb-4">
                        {questions.map((q, index) => (
                            <li key={index} className="flex items-center justify-between bg-white/10 p-2 rounded-md text-sm text-gray-300 border border-white/10">
                                <span>{index + 1}. {q}</span>
                                <button type="button" onClick={() => handleRemoveQuestion(index)} className="text-red-400 hover:text-red-300 transition">
                                    <FiX className="w-4 h-4"/>
                                </button>
                            </li>
                        ))}
                    </ul>

                    <div className="flex items-center mt-2">
                        <input 
                            type="text" 
                            value={currentQuestion} 
                            onChange={(e) => setCurrentQuestion(e.target.value)} 
                            placeholder="e.g., What's your GitHub?" 
                            className="flex-grow px-4 py-2 bg-slate-800 text-white border border-white/10 rounded-l-md focus:border-indigo-500" 
                        />
                        <button 
                            type="button" 
                            onClick={handleAddQuestion} 
                            disabled={!currentQuestion.trim()}
                            className="bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-r-md transition disabled:bg-indigo-800/50"
                        >
                            <FiPlusCircle className="w-5 h-5"/>
                        </button>
                    </div>
                </div>
                
                {/* Submit Button */}
                <button type="submit" disabled={loading} className="btn-neon-primary w-full py-3 mt-4 flex items-center justify-center text-xl">
                    {loading ? 'Creating Group...' : <><FiPlusCircle className="mr-2"/> Create Group</>}
                </button>
            </form>
        </div>
    );
};

export default GroupForm;