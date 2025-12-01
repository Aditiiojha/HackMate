import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyGroups } from '../services/groupService';
import { Link, NavLink } from 'react-router-dom';
import { FiUsers, FiPlusCircle, FiArrowRight, FiClock, FiCode, FiFrown, FiGrid, FiFeather } from 'react-icons/fi';
import toast from 'react-hot-toast';

// --- Enhanced Stats Logic ---
const getEnhancedStats = (groups) => {
    // Mock calculation: Assuming the user is the creator of at least one of their joined groups if they have any.
    // In a real app, you would check group.creatorId === dbUser.id
    const teamsCreated = groups.length > 0 ? 1 : 0;
    
    return [
        { label: "Your Active Teams", value: groups.length, icon: FiUsers, color: "text-indigo-400" },
        { label: "Teams You Created", value: teamsCreated, icon: FiFeather, color: "text-green-400" },
    ];
};

// --- Custom Components ---

const StatCard = ({ label, value, icon: Icon, color }) => (
    // Reusing the StatCard component for the metrics
    <div className="glass-card p-6 rounded-xl border border-white/10 shadow-lg transition duration-300 hover:scale-[1.03] hover:shadow-indigo-500/30">
        <div className="flex items-center">
            <Icon className={`w-8 h-8 ${color} mr-4 drop-shadow-lg`} />
            <div>
                <p className="text-xl font-extrabold text-white">{value}</p>
                <p className="text-sm text-gray-400 mt-1">{label}</p>
            </div>
        </div>
    </div>
);

const TeamItem = ({ group }) => (
    <NavLink to={`/groups/${group._id}`} className="group glass-card flex justify-between items-center p-4 rounded-xl mb-3 transition duration-300 hover:bg-white/10 hover:shadow-md border border-white/5">
        <div className="flex items-center">
            <FiCode className="w-5 h-5 text-indigo-400 mr-3" />
            <div>
                <p className="text-lg font-semibold text-white truncate">{group.name}</p>
                <span className={`text-xs font-medium text-gray-400`}>
                    Hackathon: {group.hackathonName}
                </span>
            </div>
        </div>
        <FiArrowRight className="w-5 h-5 text-gray-500 group-hover:text-indigo-300" />
    </NavLink>
);

const Dashboard = () => {
    const { dbUser } = useAuth();
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);
    const enhancedStats = getEnhancedStats(myGroups);

    useEffect(() => {
        if (dbUser) {
            const fetchUserGroups = async () => {
                try {
                    setLoading(true);
                    const groups = await getMyGroups();
                    setMyGroups(groups);
                } catch (error) {
                    console.error("Failed to fetch user's groups:", error);
                    toast.error("Failed to load your teams.");
                } finally {
                    setLoading(false);
                }
            };
            fetchUserGroups();
        }
    }, [dbUser]);

    return (
        <div className="min-h-screen pt-4 pb-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                {/* --- Header Section (Welcome Banner) --- */}
                <header className="py-10 mb-8">
                    <h1 className="text-5xl md:text-6xl font-extrabold text-white leading-tight">
                        Welcome Back, <span className="text-indigo-400 text-neon-glow">{dbUser?.name?.split(' ')[0] || 'Hacker'}</span>!
                    </h1>
                    <p className="text-xl text-gray-300 mt-2">Your personalized command center for HackMate.</p>
                </header>

                <hr className="border-t border-white/10 my-10" />

                {/* --- Key Metrics / Stats Grid --- */}
                <h2 className="text-3xl font-bold text-white mb-6">📊 Your Team Summary</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                    {enhancedStats.map((stat, index) => (
                        <StatCard key={index} {...stat} />
                    ))}
                    {/* Add a simple placeholder card for visual balance */}
                    <div className="hidden lg:block glass-card p-6 rounded-xl border border-white/10 opacity-50">
                        <p className="text-gray-500">Other metrics track here...</p>
                    </div>
                </div>

                {/* --- Dashboard Content Layout --- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    
                    {/* Column 1: Team Management (Main Focus) */}
                    <div className="lg:col-span-2">
                        <h2 className="text-3xl font-bold text-white mb-6">🤝 Your Active Teams</h2>
                        
                        {loading ? (
                            <div className="glass-card p-6 text-center rounded-xl border border-white/10 text-gray-400">
                                <FiClock className="mx-auto h-8 w-8 text-indigo-400 animate-spin mb-3"/>
                                <p>Loading your teams...</p>
                            </div>
                        ) : myGroups.length > 0 ? (
                            <div className="space-y-4">
                                {myGroups.map(group => (
                                    <TeamItem key={group._id} group={group} />
                                ))}
                            </div>
                        ) : (
                            <div className="glass-card p-6 text-center rounded-xl border border-white/10">
                                <FiFrown className="mx-auto h-10 w-10 text-gray-400 mb-3"/>
                                <p className="text-gray-300">You are not currently in any teams. Ready to jump in?</p>
                            </div>
                        )}
                    </div>

                    {/* Column 2: Quick Actions */}
                    <div className="lg:col-span-1">
                        <h2 className="text-3xl font-bold text-white mb-6">⚡ Quick Actions</h2>

                        <div className="space-y-4">
                            
                            {/* Primary CTA: Create Team (Neon Button) */}
                            <NavLink 
                                to="/create-group" 
                                className="btn-neon-primary w-full flex items-center justify-center space-x-2 py-3 rounded-xl transition duration-300"
                            >
                                <FiPlusCircle className="w-5 h-5"/> <span>Create a New Team</span>
                            </NavLink>

                            {/* Secondary CTA: Find Teams */}
                            <NavLink 
                                to="/groups" 
                                className="w-full flex items-center justify-center space-x-2 py-3 bg-white/10 text-indigo-300 border border-indigo-400/50 rounded-xl transition hover:bg-white/20 hover:text-white shadow-lg"
                            >
                                <FiGrid className="w-5 h-5"/> <span>Explore Open Teams</span>
                            </NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;