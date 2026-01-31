import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../api/axios';
import toast from 'react-hot-toast';
import CompanyLogo from '../components/CompanyLogo';

const JobDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedFile, setSelectedFile] = useState(null);
    const [applying, setApplying] = useState(false);

    // Check if user is logged in
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    const isCandidate = user.role === 'user';

    useEffect(() => {
        const fetchJob = async () => {
            try {
                // If not logged in, we might need a public endpoint for details 
                // OR we just use the protected one and handle the error.
                // For now, let's assume we use the existing endpoint. 
                // Note: The backend route '/jobs/:id' is currently protected (needs auth).
                
                const config = token ? { headers: { 'x-auth-token': token } } : {};
                
                // Try fetching. If 401, redirect to login
                const res = await API.get(`/jobs/${id}`, config);
                setJob(res.data);
            } catch (err) {
                if(err.response && err.response.status === 401) {
                    toast.error("Please login to view job details");
                    navigate('/login');
                } else {
                    toast.error("Job not found");
                    navigate('/jobs');
                }
            } finally {
                setLoading(false);
            }
        };
        fetchJob();
    }, [id, token, navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            toast.error("Only PDF files are allowed!");
            return;
        }
        setSelectedFile(file);
    };

    const handleApply = async () => {
        if (!selectedFile) return toast.error("Please attach your Resume (PDF)");
        
        setApplying(true);
        const loadingToast = toast.loading("Sending Application...");

        try {
            const formData = new FormData();
            formData.append('jobId', job._id);
            formData.append('jobTitle', job.title);
            formData.append('company', job.company);
            formData.append('resume', selectedFile);

            const config = { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } };
            await API.post('/apply', formData, config);
            
            toast.dismiss(loadingToast);
            toast.success("Application Sent Successfully! 🎉");
            navigate('/dashboard'); 
        } catch (err) {
            toast.dismiss(loadingToast);
            toast.error(err.response?.data?.message || "Application Failed");
        } finally {
            setApplying(false);
        }
    };

    if (loading) return <div className="text-center mt-20 font-bold text-[#6366f1]">Loading Job Details...</div>;
    if (!job) return null;

    return (
        <div className="min-h-screen bg-[#f8fcfc] font-sans text-gray-800 p-8">
            <button onClick={() => navigate(-1)} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition text-sm flex items-center gap-2">
                &larr; Back
            </button>
            <br />
            <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                {/* Header Banner */}
                <div className="bg-[#2c1e6d] p-8 text-white">
                    <div className="flex items-center gap-6">
                        <div className="bg-white p-2 rounded-xl">
                            <CompanyLogo company={job.company} className="w-16 h-16" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold">{job.title}</h1>
                            <p className="text-indigo-200 text-lg">{job.company} • {job.location}</p>
                        </div>
                    </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* LEFT: Description */}
                    <div className="md:col-span-2 space-y-6">
                        <div>
                            <h3 className="text-xl font-bold text-[#2c1e6d] mb-3">Job Description</h3>
                            <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                                {job.description}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-[#2c1e6d] mb-3">Required Skills</h3>
                            <div className="flex flex-wrap gap-2">
                                {job.requiredSkills?.map((skill, i) => (
                                    <span key={i} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full font-bold text-sm">
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: Action Card */}
                    <div className="md:col-span-1">
                        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200 sticky top-8">
                            <div className="mb-6">
                                <p className="text-gray-500 text-sm font-bold uppercase">Salary</p>
                                <p className="text-xl font-bold text-green-600">{job.salary}</p>
                            </div>

                            {/* Apply Section - Only for Candidates */}
                            {isCandidate ? (
                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Upload Resume (PDF)</label>
                                        <input 
                                            type="file" 
                                            accept=".pdf" 
                                            onChange={handleFileChange}
                                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-[#e3f6f5] file:text-[#2c1e6d] hover:file:bg-[#d0f0ee] cursor-pointer"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleApply} 
                                        disabled={applying}
                                        className="w-full bg-[#6366f1] text-white py-3 rounded-lg font-bold hover:bg-[#4f46e5] transition shadow-md disabled:opacity-50"
                                    >
                                        {applying ? 'Sending...' : 'Apply Now'}
                                    </button>
                                </div>
                            ) : token ? (
                                <div className="bg-blue-100 text-blue-800 p-4 rounded-lg text-sm text-center font-bold">
                                    Recruiter View Mode
                                </div>
                            ) : (
                                <button 
                                    onClick={() => navigate('/login')} 
                                    className="w-full bg-[#2c1e6d] text-white py-3 rounded-lg font-bold hover:bg-opacity-90 transition"
                                >
                                    Login to Apply
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;