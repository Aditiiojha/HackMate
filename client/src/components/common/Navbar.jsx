import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';
import { FiUsers, FiPlusCircle, FiLogOut, FiUser } from 'react-icons/fi';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Logged out successfully");
      navigate('/login');
    } catch (error) {
      toast.error("Failed to log out");
    }
  };

  // Base styles for regular links
  const linkBaseStyles = "px-3 py-2 rounded-full text-sm font-medium transition duration-300 flex items-center space-x-2";
  // Styles for regular links against the dark background
  const linkStyles = `${linkBaseStyles} text-gray-300 hover:text-white hover:bg-white/10`;
  // Active state with a subtle neon underline effect
  const activeLinkStyles = "text-white relative after:content-[''] after:absolute after:bottom-0 after:left-1/2 after:-translate-x-1/2 after:w-2/3 after:h-0.5 after:bg-indigo-400 after:rounded-full after:shadow-md after:shadow-indigo-500/50";

  return (
    <nav className="sticky top-0 z-50 glass-card bg-slate-900/30 border-b border-white/10 shadow-xl backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            {/* Brand with Neon Glow */}
            <NavLink to="/dashboard" className="flex items-center text-white font-extrabold text-xl text-neon-glow">
              <span className="mr-2 text-indigo-400 text-2xl">⚡</span> HackMate
            </NavLink>
            {/* Navigation Links */}
            <div className="hidden md:block ml-8 lg:ml-12">
              <div className="flex items-baseline space-x-1">
                <NavLink 
                  to="/groups" 
                  className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}
                >
                  <FiUsers className="w-5 h-5"/> <span>Find Teams</span>
                </NavLink>
                {/* 'Create Team' is now the primary CTA and will be repeated on the right */}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {/* Primary CTA: Create Team (Neon Button) */}
            <NavLink 
              to="/create-group" 
              className="btn-neon-primary hidden sm:flex items-center space-x-1"
            >
              <FiPlusCircle className="w-5 h-5"/> <span>Create Team</span>
            </NavLink>

            {/* Secondary Actions */}
            <NavLink 
              to="/profile" 
              className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}
            >
              <FiUser className="w-5 h-5"/> <span className="hidden md:block">My Profile</span>
            </NavLink>
            <button 
              onClick={handleLogout} 
              className={`${linkStyles} !p-2 rounded-full`}
              title="Logout"
            >
              <FiLogOut className="w-5 h-5"/>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;