import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const PostJob = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        title: '',
        company: '',
        location: '',
        salary: '',
        description: '',
        requiredSkills: ''
    });

    const { title, company, location, salary, description, requiredSkills } = formData;

    // Get user for Avatar in Navbar
    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            
            await API.post('/jobs', formData, config);
            
            toast.success("Job Posted Successfully! 🚀");
            navigate('/dashboard'); 
        } catch (err) {
            console.error(err);
            toast.error("Failed to post job");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 font-sans text-gray-800">
            {/* Navbar */}
            <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-50 px-6 py-4">
                <div className="max-w-5xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer" onClick={() => navigate('/dashboard')}>SkillSync</h1>
                </div>
                    <div className="flex items-center gap-4">
                        <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition text-sm flex items-center gap-2">Dashboard</button>
                        <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
                             {user?.avatar ? <img src={`http://localhost:5000/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" /> : "👤"}
                        </button>
                    </div>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto p-6 md:p-10">
                <div className="mb-8 text-center">
                    <h1 className="text-3xl font-bold text-[#2c1e6d]">Post a New Job</h1>
                    <p className="text-gray-500 mt-2">Find the perfect talent for your team.</p>
                </div>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-indigo-50 p-4 border-b border-indigo-100 flex items-center gap-3">
                         <span className="text-2xl">💼</span>
                         <p className="font-bold text-indigo-900">Job Details</p>
                    </div>
                    
                    <form onSubmit={onSubmit} className="p-8 space-y-6">
                        {/* Title */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Job Title</label>
                            <input 
                                type="text" 
                                name="title" 
                                value={title} 
                                onChange={onChange} 
                                required 
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-gray-50 focus:bg-white"
                                placeholder="e.g. Senior React Developer"
                            />
                        </div>

                        {/* Grid: Company & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Company Name</label>
                                <input 
                                    type="text" 
                                    name="company" 
                                    value={company} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-gray-50 focus:bg-white"
                                    placeholder="e.g. TechCorp Inc."
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Location</label>
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={location} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-gray-50 focus:bg-white"
                                    placeholder="e.g. Remote / Bangalore"
                                />
                            </div>
                        </div>

                        {/* Salary */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Salary Range (CTC)</label>
                            <input 
                                type="text" 
                                name="salary" 
                                value={salary} 
                                onChange={onChange} 
                                required 
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-gray-50 focus:bg-white"
                                placeholder="e.g. ₹12L - ₹18L per annum"
                            />
                        </div>

                        {/* Skills */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Required Skills (Comma separated)</label>
                            <input 
                                type="text" 
                                name="requiredSkills" 
                                value={requiredSkills} 
                                onChange={onChange} 
                                required 
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-gray-50 focus:bg-white"
                                placeholder="e.g. React, Node.js, MongoDB, AWS"
                            />
                            <p className="text-xs text-gray-400 mt-2">These tags help candidates find your job.</p>
                        </div>

                        {/* Description */}
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Job Description</label>
                            <textarea 
                                name="description" 
                                value={description} 
                                onChange={onChange} 
                                required 
                                rows="6"
                                className="w-full p-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-gray-50 focus:bg-white"
                                placeholder="Describe the role, responsibilities, and perks..."
                            ></textarea>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center gap-4 pt-4 border-t border-gray-100">
                             <button 
                                type="button"
                                onClick={() => navigate('/dashboard')}
                                className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={loading}
                                className="flex-[2] bg-[#2c1e6d] text-white py-3 rounded-xl font-bold hover:bg-[#1a1145] transition shadow-lg transform active:scale-95"
                            >
                                {loading ? 'Posting...' : 'Post Job Now'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PostJob;