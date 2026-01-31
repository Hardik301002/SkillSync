import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
    const [users, setUsers] = useState([]);
    const [jobs, setJobs] = useState([]);
    const [activeTab, setActiveTab] = useState('users'); 
    const navigate = useNavigate();

    // Fetch Data on Load
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem('token');
            const rawUser = localStorage.getItem('user');
            const user = rawUser ? JSON.parse(rawUser) : null;
            
            // Security Check
            if (!user || user.role !== 'admin') {
                toast.error("Access Denied");
                return navigate('/dashboard');
            }

            try {
                const config = { headers: { 'x-auth-token': token } };
                
                // Fetch Users & Jobs in parallel
                const [usersRes, jobsRes] = await Promise.all([
                    API.get('/admin/users', config),
                    API.get('/admin/jobs', config)
                ]);

                setUsers(usersRes.data);
                setJobs(jobsRes.data);
            } catch (err) {
                console.error(err);
                toast.error("Admin Load Failed");
            }
        };
        fetchData();
    }, [navigate]);

    // Delete Logic
    const handleDeleteUser = async (id) => {
        if (!window.confirm("Delete this user?")) return;
        try {
            const token = localStorage.getItem('token');
            await API.delete(`/admin/users/${id}`, { headers: { 'x-auth-token': token } });
            setUsers(users.filter(u => u._id !== id));
            toast.success("User Banned");
        } catch (err) { toast.error("Delete Failed"); }
    };

    const handleDeleteJob = async (id) => {
        if (!window.confirm("Delete this job?")) return;
        try {
            const token = localStorage.getItem('token');
            await API.delete(`/jobs/${id}`, { headers: { 'x-auth-token': token } });
            setJobs(jobs.filter(j => j._id !== id));
            toast.success("Job Removed");
        } catch (err) { toast.error("Delete Failed"); }
    };

    return (
        <div className="min-h-screen bg-[#1e1e2e] font-sans text-gray-200">
            {/* Navbar */}
            <div className="bg-[#27273a] px-8 py-4 flex justify-between items-center shadow-lg">
                <h1 className="text-2xl font-bold text-[#6366f1]">SkillSync Admin</h1>
                <button onClick={() => navigate('/dashboard')} className="text-gray-400 hover:text-white font-bold">&larr; Main Site</button>
            </div>

            <div className="max-w-6xl mx-auto p-10">
                <div className="flex gap-4 mb-8">
                    <button 
                        onClick={() => setActiveTab('users')}
                        className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'users' ? 'bg-[#6366f1] text-white' : 'bg-[#27273a] text-gray-400 hover:bg-[#32324a]'}`}
                    >
                        Users ({users.length})
                    </button>
                    <button 
                        onClick={() => setActiveTab('jobs')}
                        className={`px-6 py-2 rounded-lg font-bold transition ${activeTab === 'jobs' ? 'bg-[#6366f1] text-white' : 'bg-[#27273a] text-gray-400 hover:bg-[#32324a]'}`}
                    >
                        Jobs ({jobs.length})
                    </button>
                </div>

                {/* USERS TABLE */}
                {activeTab === 'users' && (
                    <div className="bg-[#27273a] rounded-xl overflow-hidden shadow-xl">
                        <table className="w-full text-left">
                            <thead className="bg-[#32324a] text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Email</th>
                                    <th className="px-6 py-4">Role</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {users.map(u => (
                                    <tr key={u._id} className="hover:bg-[#2c2c40]">
                                        <td className="px-6 py-4 font-medium">{u.name}</td>
                                        <td className="px-6 py-4 text-gray-400">{u.email}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${u.role === 'admin' ? 'bg-red-500/20 text-red-400' : u.role === 'recruiter' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                                {u.role.toUpperCase()}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            {u.role !== 'admin' && (
                                                <button onClick={() => handleDeleteUser(u._id)} className="text-red-400 hover:text-red-300 font-bold text-sm">Ban User</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* JOBS TABLE */}
                {activeTab === 'jobs' && (
                    <div className="bg-[#27273a] rounded-xl overflow-hidden shadow-xl">
                        <table className="w-full text-left">
                            <thead className="bg-[#32324a] text-gray-400 uppercase text-xs">
                                <tr>
                                    <th className="px-6 py-4">Title</th>
                                    <th className="px-6 py-4">Company</th>
                                    <th className="px-6 py-4">Posted By</th>
                                    <th className="px-6 py-4">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {jobs.map(j => (
                                    <tr key={j._id} className="hover:bg-[#2c2c40]">
                                        <td className="px-6 py-4 font-medium">{j.title}</td>
                                        <td className="px-6 py-4 text-gray-400">{j.company}</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{j.postedBy?.email || 'Unknown'}</td>
                                        <td className="px-6 py-4">
                                            <button onClick={() => handleDeleteJob(j._id)} className="text-red-400 hover:text-red-300 font-bold text-sm">Delete</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminDashboard;