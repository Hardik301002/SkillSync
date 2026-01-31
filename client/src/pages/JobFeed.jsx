import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api/axios';
import CompanyLogo from '../components/CompanyLogo';

const JobFeed = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]); 
    const [loading, setLoading] = useState(true);
    
    // Filter States
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedProfile, setSelectedProfile] = useState('');

    const locations = ['Delhi', 'Mohali', 'Pune', 'Bangalore', 'Mumbai', 'Hyderabad', 'Remote'];
    const profiles = ['Software', 'Full Stack', 'MERN', 'Java', 'AI/ML', 'Frontend', 'Backend'];

    // 1. Fetch Real Data from Backend
    useEffect(() => {
        const fetchJobs = async () => {
            try {
                // Fetches jobs from your public endpoint
                const res = await API.get('/public-jobs'); 
                setJobs(res.data);
            } catch (err) {
                console.error("Error fetching jobs", err);
            } finally {
                setLoading(false);
            }
        };
        fetchJobs();
    }, []);

    // 2. The Logic to Make Filters Work
    const filteredJobs = jobs.filter(job => {
        // Check Location (Case insensitive)
        const matchLocation = selectedLocation 
            ? (job.location && job.location.toLowerCase().includes(selectedLocation.toLowerCase())) 
            : true;
        
        // Check Profile/Title (Case insensitive)
        const matchProfile = selectedProfile 
            ? (job.title && job.title.toLowerCase().includes(selectedProfile.toLowerCase())) 
            : true;

        return matchLocation && matchProfile;
    });

    // Helper for "Posted X days ago"
    const timeSince = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        let interval = seconds / 86400;
        if (interval > 1) return Math.floor(interval) + " days ago";
        return "Today";
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 px-6 py-4">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-extrabold text-[#2c1e6d] cursor-pointer" onClick={() => navigate('/')}>SkillSync</h1>
                    <button onClick={() => navigate('/login')} className="text-[#6366f1] font-bold">Login / Sign Up</button>
                </div>
            </nav>

            <div className="max-w-7xl mx-auto px-6 py-8 flex flex-col md:flex-row gap-8">
                
                {/* LEFT: Sidebar Filters */}
                <div className="w-full md:w-72 flex-shrink-0">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-24">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-gray-900">Filters</h2>
                            {(selectedLocation || selectedProfile) && (
                                <button onClick={() => {setSelectedLocation(''); setSelectedProfile('');}} className="text-xs text-red-500 font-bold hover:underline">
                                    Clear
                                </button>
                            )}
                        </div>

                        {/* Location Group */}
                        <div className="mb-6">
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Location</h3>
                            <div className="space-y-2">
                                {locations.map(loc => (
                                    <label key={loc} className="flex items-center cursor-pointer group">
                                        <input type="radio" name="location" value={loc} checked={selectedLocation === loc} onChange={(e) => setSelectedLocation(e.target.value)} className="text-[#6366f1] focus:ring-[#6366f1]" />
                                        <span className="ml-2 text-sm text-gray-600 group-hover:text-[#6366f1] transition">{loc}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Profile Group */}
                        <div>
                            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Role</h3>
                            <div className="space-y-2">
                                {profiles.map(role => (
                                    <label key={role} className="flex items-center cursor-pointer group">
                                        <input type="radio" name="profile" value={role} checked={selectedProfile === role} onChange={(e) => setSelectedProfile(e.target.value)} className="text-[#6366f1] focus:ring-[#6366f1]" />
                                        <span className="ml-2 text-sm text-gray-600 group-hover:text-[#6366f1] transition">{role}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* RIGHT: Job Grid */}
                <div className="flex-1">
                    {loading ? (
                        <div className="text-center py-20 text-[#6366f1] font-bold animate-pulse">Loading Jobs...</div>
                    ) : filteredJobs.length === 0 ? (
                        <div className="text-center py-20 bg-white rounded-xl border border-dashed border-gray-300">
                            <p className="text-gray-500">No jobs match your filters.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {filteredJobs.map(job => (
                                <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-lg transition flex flex-col h-full">
                                    <div className="flex items-start gap-4 mb-4">
                                        <CompanyLogo company={job.company} className="w-12 h-12" />
                                        <div>
                                            <h3 className="font-bold text-[#2c1e6d] line-clamp-1">{job.title}</h3>
                                            <p className="text-sm text-gray-500">{job.company}</p>
                                        </div>
                                    </div>
                                    
                                    <div className="flex gap-2 mb-4">
                                        <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded font-bold">{job.salary}</span>
                                        <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded font-bold">{job.location}</span>
                                    </div>

                                    <p className="text-sm text-gray-500 line-clamp-2 mb-6 flex-grow">{job.description}</p>

                                    <button 
                                        onClick={() => navigate(`/jobs/${job._id}`)} 
                                        className="w-full bg-[#f8fcfc] text-[#6366f1] border border-[#6366f1] py-2 rounded-lg font-bold hover:bg-[#6366f1] hover:text-white transition"
                                    >
                                        View Details
                                    </button>
                                    <p className="text-xs text-gray-300 text-center mt-3">Posted {timeSince(job.postedAt)}</p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default JobFeed;