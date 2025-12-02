import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FcGoogle } from 'react-icons/fc';
import { FiMail, FiLock, FiZap, FiLogIn } from 'react-icons/fi';

const Login = () => {
    // ... (rest of state and functions remain the same)

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

    const inputClasses = "w-full px-4 py-3 bg-white/5 text-white border border-white/10 rounded-lg shadow-inner focus:border-neon-cyan focus:ring-1 focus:ring-neon-cyan transition duration-300";
    const labelClasses = "text-sm font-semibold text-gray-300 mb-1 flex items-center";

    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 py-12 sm:py-20 overflow-hidden">
            
            {/* Full-Screen Background Image with Slow Movement */}
            <div 
                className="absolute inset-0 bg-cover bg-center animate-bg-slow bg-black" 
                style={{ backgroundImage: "url('/image_f8f486.png')" }}
            >
                {/* Static Dark Overlay */}
                <div className="absolute inset-0 bg-black/70 z-0"></div>
                {/* Moving Gradient Overlay (Continuous TL to BR) */}
                <div className="absolute inset-0 gradient-overlay-animated z-0 opacity-50"></div>
            </div>
            
            <div className="max-w-4xl w-full relative z-10">
                {/* Central Card with Glassmorphism and Neon Glow */}
                <div className="glass-card p-0 rounded-3xl shadow-neon border border-white/10 overflow-hidden">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2">
                        
                        {/* Left Column: Brand & Aesthetic (Blur Fix Applied to Content) */}
                        <div className="p-10 bg-blue-900/40 flex flex-col justify-between border-r border-white/10 space-y-6 transform translate-z-0">
                            <div className="text-white">
                                <h2 className="text-4xl font-extrabold text-white mb-4 flex items-center">
                                    <FiZap className="mr-3 text-neon-cyan"/> HackMate
                                </h2>
                                <p className="text-gray-300 text-xl font-semibold">
                                    Find your crew. Ship your project. Win the hackathon.
                                </p>
                            </div>
                            <div className="mt-10">
                                <p className="text-gray-400 text-sm">Join a community of top-tier hackers and developers.</p>
                            </div>
                        </div>

                        {/* Right Column: Login Form (Blur Fix Applied to Content) */}
                        <div className="p-10 flex flex-col justify-center bg-black/10 space-y-6 transform translate-z-0">
                            <h3 className="text-3xl font-extrabold text-white mb-2">Sign In</h3>
                            <p className="text-gray-400">
                                Access your personalized hacker dashboard.
                            </p>

                            <form onSubmit={handleEmailLogin} className="space-y-5">
                                
                                {/* Email Input */}
                                <div>
                                    <label className={labelClasses}><FiMail className="mr-2"/> Email</label>
                                    <input 
                                        name="email" 
                                        type="email" 
                                        placeholder="your.email@kiit.ac.in" 
                                        required 
                                        onChange={handleChange} 
                                        className={inputClasses}
                                    />
                                </div>

                                {/* Password Input */}
                                <div>
                                    <label className={labelClasses}><FiLock className="mr-2"/> Password</label>
                                    <input 
                                        name="password" 
                                        type="password" 
                                        placeholder="••••••••" 
                                        required 
                                        onChange={handleChange} 
                                        className={inputClasses}
                                    />
                                </div>

                                {/* Login Button (Neon CTA with Hover Animation) */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-neon-primary w-full py-3 mt-4 flex items-center justify-center text-lg disabled:opacity-50 hover:animate-pulse-neon"
                                >
                                    {loading ? 'Logging In...' : <><FiLogIn className="mr-2"/> Log In</>}
                                </button>
                            </form>

                            <div className="my-6 flex items-center">
                                <hr className="flex-grow border-gray-700"/>
                                <span className="px-3 text-sm text-gray-400">OR</span>
                                <hr className="flex-grow border-gray-700"/>
                            </div>

                            {/* Google Login Option */}
                            <button
                                onClick={handleGoogleLogin}
                                disabled={googleLoading}
                                className="w-full inline-flex items-center justify-center py-3 px-4 text-sm font-semibold text-white bg-white/10 border border-white/20 rounded-lg hover:bg-white/20 disabled:opacity-50 transition-colors duration-300"
                            >
                                <FcGoogle className="w-5 h-5 mr-2"/>
                                {googleLoading ? 'Signing in...' : 'Sign in with Google'}
                            </button>
                            
                            {/* Sign Up Link */}
                            <p className="mt-2 text-center text-gray-400 text-sm">
                                Don't have an account?{' '}
                                <Link to="/register" className="text-neon-cyan font-semibold hover:text-white transition">
                                    Sign Up here
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;