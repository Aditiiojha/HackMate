import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { FiMail, FiLock, FiUser, FiZap, FiCheckCircle, FiBookOpen } from 'react-icons/fi';

const Register = () => {
    // State for form data and loading status
    const [formData, setFormData] = useState({ 
        name: '', 
        college: '', 
        email: '', 
        password: '' 
    });
    const [loading, setLoading] = useState(false);
    
    // Hooks
    const { signup } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Client-side validation
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

    // Tailwind classes
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
                                    Begin your journey. Find the perfect team for your next hackathon.
                                </p>
                            </div>
                            <div className="mt-10">
                                <p className="text-gray-400 text-sm">Fast, secure registration. Ready to start hacking?</p>
                            </div>
                        </div>

                        {/* Right Column: Sign Up Form (Blur Fix Applied to Content) */}
                        <div className="p-10 flex flex-col justify-center bg-black/10 space-y-6 transform translate-z-0">
                            <h3 className="text-3xl font-extrabold text-white mb-2">Create Account</h3>
                            <p className="text-gray-400">
                                Register now and build your profile.
                            </p>

                            <form onSubmit={handleSubmit} className="space-y-4">
                                
                                {/* Name Input */}
                                <div>
                                    <label className={labelClasses}><FiUser className="mr-2"/> Full Name</label>
                                    <input 
                                        name="name" 
                                        type="text" 
                                        placeholder="Full Name" 
                                        required 
                                        onChange={handleChange} 
                                        className={inputClasses}
                                    />
                                </div>
                                
                                {/* College Input */}
                                <div>
                                    <label className={labelClasses}><FiBookOpen className="mr-2"/> College Name</label>
                                    <input 
                                        name="college" 
                                        type="text" 
                                        placeholder="College Name" 
                                        required 
                                        onChange={handleChange} 
                                        className={inputClasses}
                                    />
                                </div>
                                
                                {/* Email Input */}
                                <div>
                                    <label className={labelClasses}><FiMail className="mr-2"/> College Email</label>
                                    <input 
                                        name="email" 
                                        type="email" 
                                        placeholder="College Email (@kiit.ac.in)" 
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
                                        placeholder="Password (min. 6 characters)" 
                                        required 
                                        onChange={handleChange} 
                                        className={inputClasses}
                                    />
                                </div>
                                
                                {/* Sign Up Button (Neon CTA with Hover Animation) */}
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="btn-neon-primary w-full py-3 mt-4 flex items-center justify-center text-lg disabled:opacity-50 hover:animate-pulse-neon"
                                >
                                    {loading ? 'Creating Account...' : <><FiCheckCircle className="mr-2"/> Create Account</>}
                                </button>
                            </form>

                            {/* Login Link */}
                            <p className="mt-2 text-center text-gray-400 text-sm">
                                Already have an account?{' '}
                                <Link to="/login" className="text-neon-cyan font-semibold hover:text-white transition">
                                    Log In
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;