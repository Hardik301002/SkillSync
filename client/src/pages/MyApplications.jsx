import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const MyApplications = () => {
    const navigate = useNavigate();
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);

    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    useEffect(() => {
        const fetchApplications = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                const res = await API.get('/applications', config);
                setApplications(res.data);
            } catch (err) {
                console.error("Error fetching applications", err);
                toast.error("Failed to load applications");
            } finally {
                setLoading(false);
            }
        };
        fetchApplications();
    }, []);

    // Helper for Status Badge Styling
    const getStatusBadge = (status) => {
        const baseClasses = "px-4 py-1 rounded-full text-[10px] font-bold text-white uppercase tracking-wider shadow-sm";
        switch (status) {
            case 'Accepted': return <span className={`${baseClasses} bg-green-500`}>ACCEPTED</span>;
            case 'Rejected': return <span className={`${baseClasses} bg-red-500`}>REJECTED</span>;
            default: return <span className={`${baseClasses} bg-gray-400`}>PENDING</span>;
        }
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
            {/*  NAVBAR (Updated to match Home Page) */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm px-10 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                     <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                     <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">SkillSync</h1>
                </div>

                <div className="flex items-center gap-6">
                    {/*  NEW DASHBOARD BUTTON (Indigo Style) */}
                    <button 
                        onClick={() => navigate('/dashboard')} 
                        className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
                    >
                        Dashboard
                    </button>
                    
                    {/* Profile Icon */}
                    <button onClick={() => navigate('/profile')} className="w-10 h-10 rounded-full overflow-hidden border-2 border-white shadow-md ring-2 ring-gray-100 hover:ring-indigo-100 transition">
                         {user?.avatar ? <img src={`http://localhost:5000/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">👤</div>}
                    </button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-12">
                
                {/*  HEADER BOX (Matches Screenshot) */}
                <div className="bg-white border border-gray-200 py-4 text-center rounded-t-lg shadow-sm mx-auto w-full relative z-10">
                    <h2 className="text-xl font-bold text-gray-800">Applied Jobs</h2>
                </div>

                {/*  DATA TABLE */}
                <div className="bg-white mx-auto w-full shadow-sm rounded-b-lg border-x border-b border-gray-200 overflow-hidden">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wide">Job Role</th>
                                <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wide">Company</th>
                                <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wide">Salary</th>
                                <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wide">Location</th>
                                <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wide">Date Applied</th>
                                <th className="py-5 px-6 font-bold text-gray-500 text-sm uppercase tracking-wide text-center">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {applications.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="text-center py-12">
                                        <div className="flex flex-col items-center text-gray-400">
                                            <span className="text-4xl mb-2">📄</span>
                                            <p className="font-medium">No applications found.</p>
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                applications.map((app) => (
                                    <tr key={app._id} className="hover:bg-indigo-50/30 transition border-b border-gray-100 last:border-0 group">
                                        <td className="py-5 px-6 font-bold text-gray-800 group-hover:text-indigo-700 transition">{app.jobTitle}</td>
                                        <td className="py-5 px-6 font-semibold text-gray-700">{app.company}</td>
                                        
                                        {/* Populated Data */}
                                        <td className="py-5 px-6 text-gray-600 font-medium font-mono text-sm">
                                            {app.jobId?.salary || 'N/A'}
                                        </td>
                                        <td className="py-5 px-6 text-gray-600 font-medium">
                                            {app.jobId?.location || 'N/A'}
                                        </td>

                                        {/* Date formatting */}
                                        <td className="py-5 px-6 text-gray-500 text-sm">
                                            {new Date(app.createdAt || Date.now()).toISOString().split('T')[0]}
                                        </td>
                                        
                                        {/* Status Pill */}
                                        <td className="py-5 px-6 text-center">
                                            {getStatusBadge(app.status)}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="text-center mt-6 text-gray-400 text-sm">
                    Keep applying! Your dream job is just around the corner.
                </div>
            </div>
        </div>
    );
};

export default MyApplications;