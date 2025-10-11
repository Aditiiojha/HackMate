import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({ 
    name: '', 
    college: '', 
    email: '', 
    password: '' 
  });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email.endsWith('@kiit.ac.in')) {
      return toast.error('Please use a valid KIIT email (@kiit.ac.in).');
    }
    if (formData.password.length < 6) {
        return toast.error('Password must be at least 6 characters long.');
    }

    setLoading(true);
    try {
      await signup(formData.name, formData.email, formData.password, formData.college);
      toast.success('Registration successful! Welcome to HackMate.');
      navigate('/dashboard'); // Redirect to dashboard or a profile setup page
    } catch (error) {
      toast.error(error.message || 'Failed to register. This email may already be in use.');
      console.error("Registration Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Create your Account</h2>
            <p className="mt-2 text-sm text-gray-600">Join the next generation of hackathon builders.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="name" 
            type="text" 
            placeholder="Full Name" 
            required 
            onChange={handleChange} 
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <input 
            name="college" 
            type="text" 
            placeholder="College Name" 
            required 
            onChange={handleChange} 
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <input 
            name="email" 
            type="email" 
            placeholder="College Email (@kiit.ac.in)" 
            required 
            onChange={handleChange} 
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password (min. 6 characters)" 
            required 
            onChange={handleChange} 
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 mt-2 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-300"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-indigo-600 hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;