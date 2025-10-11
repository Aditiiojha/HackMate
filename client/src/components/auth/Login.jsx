import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  
  const { login, googleSignIn } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(formData.email, formData.password);
      toast.success('Logged in successfully!');
      navigate('/dashboard'); // Redirect after successful login
    } catch (error) {
      toast.error(error.message || 'Failed to log in. Please check your credentials.');
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    try {
      await googleSignIn();
      toast.success('Signed in with Google successfully!');
      navigate('/dashboard');
    } catch (error) {
      toast.error(error.message || 'Failed to sign in with Google.');
      console.error("Google Sign-In Error:", error);
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-xl">
        <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back!</h2>
            <p className="mt-2 text-sm text-gray-600">Log in to find your hackathon team.</p>
        </div>
        
        <form onSubmit={handleEmailLogin} className="space-y-6">
          <input 
            name="email" 
            type="email" 
            placeholder="Email Address" 
            required 
            onChange={handleChange} 
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <input 
            name="password" 
            type="password" 
            placeholder="Password" 
            required 
            onChange={handleChange} 
            className="w-full px-4 py-2 text-gray-900 bg-gray-100 border-transparent rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white"
          />
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 font-semibold text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-400 transition-colors duration-300"
          >
            {loading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <div className="relative">
            <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
                <span className="px-2 text-gray-500 bg-white">Or continue with</span>
            </div>
        </div>

        <div>
            <button
                onClick={handleGoogleLogin}
                disabled={googleLoading}
                className="w-full inline-flex items-center justify-center py-3 px-4 text-sm font-semibold text-gray-800 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 transition-colors duration-300"
            >
                <FcGoogle className="w-5 h-5 mr-2"/>
                {googleLoading ? 'Signing in...' : 'Sign in with Google'}
            </button>
        </div>

        <p className="text-sm text-center text-gray-600">
          Don't have an account?{' '}
          <Link to="/register" className="font-medium text-indigo-600 hover:underline">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;