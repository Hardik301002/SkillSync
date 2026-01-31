import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SavedJobs = () => {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSavedJobs = async () => {
            const token = localStorage.getItem('token');
            if (!token) return navigate('/login');
            
            try {
                const config = { headers: { 'x-auth-token': token } };
                const res = await API.get('/saved-jobs', config);
                setJobs(res.data);
            } catch (err) {
                console.error(err);
                toast.error("Could not load saved jobs.");
            } finally {
                setLoading(false);
            }
        };
        fetchSavedJobs();
    }, [navigate]);

    const handleRemove = async (jobId) => {
        const token = localStorage.getItem('token');
        try {
            const config = { headers: { 'x-auth-token': token } };
            await API.put(`/jobs/${jobId}/save`, {}, config);
            
            // Remove from UI instantly
            setJobs(jobs.filter(job => job._id !== jobId));
            toast.success("Job removed from bookmarks.");
        } catch (err) {
            toast.error("Error removing job");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            toast.error("⚠️ Only PDF files are allowed!");
            e.target.value = ''; setSelectedFile(null); return;
        }
        setSelectedFile(file);
    };

    const handleApply = async (jobId, jobTitle, company) => {
        const token = localStorage.getItem('token');
        if (!selectedFile) return toast.error("⚠️ Please attach your Resume (PDF)!");
        
        const loadingToast = toast.loading("Sending Application...");
        try {
            const formData = new FormData();
            formData.append('jobId', jobId);
            formData.append('jobTitle', jobTitle);
            formData.append('company', company);
            formData.append('resume', selectedFile);
            
            const config = { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } };
            await API.post('/apply', formData, config);
            
            toast.dismiss(loadingToast);
            toast.success(`Application sent to ${company}!`);
            setSelectedFile(null);
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(err.response?.data?.message || "Application Failed");
        }
    };

    if (loading) return <div className="text-center mt-20 font-bold text-[#6366f1]">Loading Saved Jobs...</div>;

    return (
        <div className="min-h-screen bg-[#f8fcfc] font-sans text-gray-800">
            {/* Navbar */}
            <div className="bg-white shadow-sm border-b border-gray-200 px-8 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2" onClick={() => navigate('/dashboard')}>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer">S</div>
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer">SkillSync</span>
                </div>
                <button onClick={() => navigate('/dashboard')} className="text-[#6366f1] font-bold border border-[#6366f1] px-4 py-1 rounded hover:bg-[#6366f1] hover:text-white transition">
                    &larr; Back to Dashboard
                </button>
            </div>

            <div className="max-w-6xl mx-auto p-10">
                <h2 className="text-3xl font-bold text-[#2c1e6d] mb-2">🔖 My Saved Jobs</h2>
                <p className="text-gray-500 mb-8">Jobs you bookmarked for later.</p>

                {jobs.length === 0 ? (
                    <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-100">
                        <h3 className="text-xl font-bold text-gray-700">No saved jobs yet.</h3>
                        <p className="text-gray-500 mt-2">Go to the dashboard and click the ❤️ icon on jobs you like!</p>
                        <button onClick={() => navigate('/dashboard')} className="mt-4 text-[#6366f1] font-bold hover:underline">Go to Dashboard &rarr;</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm hover:shadow-lg transition duration-300 border border-gray-100 flex flex-col justify-between group relative">
                                
                                {/* REMOVE BUTTON */}
                                <button 
                                    onClick={() => handleRemove(job._id)}
                                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 font-bold text-sm bg-gray-50 px-2 py-1 rounded hover:bg-red-50 transition"
                                    title="Remove from Saved"
                                >
                                    ✕ Remove
                                </button>

                                <div>
                                    <h3 onClick={() => navigate(`/jobs/${job._id}`)} className="text-xl font-bold text-[#2c1e6d] hover:text-[#6366f1] cursor-pointer hover:underline mb-1 pr-8">
                                        {job.title}
                                    </h3>
                                    <p className="text-gray-600 font-medium mb-4">{job.company}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {(job.requiredSkills || []).slice(0, 3).map((skill, index) => (
                                            <span key={index} className="text-xs bg-[#f0f4f8] text-gray-600 px-2 py-1 rounded border border-gray-200">{skill}</span>
                                        ))}
                                    </div>

                                    <div className="mb-4 bg-gray-50 p-3 rounded-lg border border-dashed border-gray-300">
                                        <label className="block text-xs font-bold text-gray-500 mb-2">📎 Attach Resume (PDF)</label>
                                        <input type="file" accept=".pdf" onChange={handleFileChange} className="block w-full text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#e3f6f5] file:text-[#2c1e6d] hover:file:bg-[#d0f0ee] cursor-pointer" />
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleApply(job._id, job.title, job.company)}
                                    className="w-full bg-[#6366f1] text-white py-2.5 rounded-lg font-bold hover:bg-[#4f46e5] transition shadow-md"
                                >
                                    Apply Now
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SavedJobs;