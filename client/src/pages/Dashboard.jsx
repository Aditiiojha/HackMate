import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { getMyGroups } from '../services/groupService';
import { Link } from 'react-router-dom';
import { FiGrid, FiPlusSquare } from 'react-icons/fi';

const Dashboard = () => {
    const { dbUser } = useAuth();
    const [myGroups, setMyGroups] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Fetch the user's groups only when we have the dbUser object
        if (dbUser) {
            const fetchUserGroups = async () => {
                try {
                    setLoading(true);
                    const groups = await getMyGroups();
                    setMyGroups(groups);
                } catch (error) {
                    console.error("Failed to fetch user's groups:", error);
                } finally {
                    setLoading(false);
                }
            };
            fetchUserGroups();
        }
    }, [dbUser]); // This effect runs when the dbUser is loaded

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <div className="bg-white shadow-md rounded-lg p-6 mb-6">
                    <h1 className="text-3xl font-bold text-gray-900">Welcome, {dbUser?.name}!</h1>
                    <p className="mt-2 text-gray-600">This is your main dashboard. From here you can find new teams or manage the ones you've joined.</p>
                </div>

                <div className="bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-semibold text-gray-800 border-b pb-3 mb-4">My Teams</h2>
                    {loading ? (
                        <p className="text-gray-500">Loading your teams...</p>
                    ) : myGroups.length > 0 ? (
                        <ul className="space-y-3">
                            {myGroups.map(group => (
                                <li key={group._id} className="p-4 border rounded-md hover:bg-gray-50 transition-colors">
                                    <Link to={`/groups/${group._id}`} className="flex justify-between items-center">
                                        <div>
                                            <p className="font-bold text-indigo-700">{group.name}</p>
                                            <p className="text-sm text-gray-500">{group.hackathonName}</p>
                                        </div>
                                        <span className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">{group.status}</span>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <div className="text-center py-8">
                            <p className="text-gray-500 mb-4">You haven't joined any teams yet.</p>
                            <div className="flex justify-center space-x-4">
                                <Link to="/groups" className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                    <FiGrid className="mr-2" /> Find a Team
                                </Link>
                                <Link to="/create-group" className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700">
                                    <FiPlusSquare className="mr-2" /> Create a Team
                                </Link>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;