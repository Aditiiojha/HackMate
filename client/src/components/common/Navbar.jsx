import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import toast from 'react-hot-toast';

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

  const linkStyles = "px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white";
  const activeLinkStyles = "bg-gray-900 text-white";

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <NavLink to="/dashboard" className="text-white font-bold text-xl">
              HackMate
            </NavLink>
            <div className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/groups" className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}>
                  Find Teams
                </NavLink>
                <NavLink to="/create-group" className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}>
                  Create Team
                </NavLink>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <div className="flex items-center">
                <NavLink to="/profile" className={({ isActive }) => isActive ? `${linkStyles} ${activeLinkStyles}` : linkStyles}>
                  My Profile
                </NavLink>
                <button onClick={handleLogout} className="ml-4 px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white">
                  Logout
                </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;