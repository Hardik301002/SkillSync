import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useParams, useNavigate } from 'react-router-dom';

const ManageJob = () => {
    const { id } = useParams(); // Job ID
    const navigate = useNavigate();
    const [applicants, setApplicants] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Fetch Applicants on Load
    useEffect(() => {
        const fetchApplicants = async () => {
            const token = localStorage.getItem('token');
            try {
                const config = { headers: { 'x-auth-token': token } };
                const res = await API.get(`/jobs/${id}/applications`, config);
                setApplicants(res.data);
            } catch (err) {
                console.error(err);
                alert("Error loading applicants");
            } finally {
                setLoading(false);
            }
        };
        fetchApplicants();
    }, [id]);

    // 2. Handle Accept/Reject Click
    const handleStatusUpdate = async (appId, newStatus) => {
        const token = localStorage.getItem('token');
        try {
            const config = { headers: { 'x-auth-token': token } };
            // Send new status to backend
            await API.put(`/applications/${appId}/status`, { status: newStatus }, config);
            
            // Update UI instantly (Optimistic UI)
            setApplicants(applicants.map(app => 
                app._id === appId ? { ...app, status: newStatus } : app
            ));
        } catch (err) {
            alert("Update failed");
        }
    };

    return (
        <div className="min-h-screen bg-[#f8fcfc] font-sans text-gray-800 p-10">
            <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition text-sm flex items-center gap-2">
                &larr; Back to Dashboard
            </button>
            <br />
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-[#2c1e6d] mb-6">Candidate Management</h1>

                {loading ? <p>Loading candidates...</p> : applicants.length === 0 ? (
                    <div className="bg-white p-10 rounded-xl shadow border text-center">
                        <h3 className="text-gray-400 font-bold">No applicants yet.</h3>
                    </div>
                ) : (
                    <div className="grid gap-4">
                        {applicants.map((app) => (
                            <div key={app._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-bold text-[#2c1e6d]">{app.user?.name || "Unknown User"}</h3>
                                    <p className="text-sm text-gray-500">{app.user?.email}</p>
                                    
                                    {/* View Resume Button */}
                                    {app.resume && (
                                        <a 
                                            href={`http://localhost:5000/${app.resume.replace(/\\/g, '/')}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="text-sm text-[#6366f1] font-bold hover:underline mt-2 block"
                                        >
                                            📄 View Resume
                                        </a>
                                    )}
                                </div>

                                {/* ACTION BUTTONS */}
                                <div className="flex items-center gap-4">
                                    <div className={`px-3 py-1 rounded-full text-xs font-bold border 
                                        ${app.status === 'Accepted' ? 'bg-green-100 text-green-700 border-green-200' : 
                                          app.status === 'Rejected' ? 'bg-red-100 text-red-700 border-red-200' : 
                                          'bg-blue-100 text-blue-700 border-blue-200'}`}>
                                        {app.status}
                                    </div>

                                    {/* Only show buttons if still 'Applied' */}
                                    {app.status === 'Applied' && (
                                        <div className="flex gap-2">
                                            <button 
                                                onClick={() => handleStatusUpdate(app._id, 'Accepted')}
                                                className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 font-bold text-sm shadow"
                                            >
                                                Accept
                                            </button>
                                            <button 
                                                onClick={() => handleStatusUpdate(app._id, 'Rejected')}
                                                className="bg-red-400 text-white px-3 py-1 rounded hover:bg-red-500 font-bold text-sm shadow"
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ManageJob;