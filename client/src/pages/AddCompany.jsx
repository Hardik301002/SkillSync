import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AddCompany = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [logoFile, setLogoFile] = useState(null);
    
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        website: '',
        description: ''
    });

    const { name, location, website, description } = formData;

    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith('image/')) {
            toast.error("Please upload an image file for the logo.");
            return;
        }
        setLogoFile(file);
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } };
            
            const data = new FormData();
            data.append('name', name);
            data.append('location', location);
            data.append('website', website);
            data.append('description', description);
            if (logoFile) data.append('logo', logoFile);
            
            //  Call the new API endpoint to create a company
            await API.post('/companies', data, config);
            
            toast.success("Company Added Successfully! ");
            navigate('/registered-companies');
        } catch (err) {
            console.error(err);
            toast.error(err.response?.data?.message || "Failed to add company");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navbar  */}
             <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 md:px-10 py-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                    <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer" onClick={() => navigate('/dashboard')}>SkillSync</h1>
                </div>
                <div className="flex items-center gap-4">
                    
                    <button onClick={() => navigate('/profile')} className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 overflow-hidden">
                         {user?.avatar ? <img src={`http://localhost:5000/${user.avatar}`} alt="Avatar" className="w-full h-full object-cover" /> : "👤"}
                    </button>
                </div>
            </nav>

            <div className="max-w-3xl mx-auto p-6 md:p-10">
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
                    <div className="flex items-center justify-between mb-8 relative">
                         <button onClick={() => navigate('/registered-companies')} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition text-sm flex items-center gap-2">
                            <span>←</span> Back
                        </button>
                        <h1 className="text-2xl font-bold text-center absolute left-0 right-0 pointer-events-none">Company Setup</h1>
                        <div className="w-[88px]"></div> {/* Spacer to balance the "Back" button */}
                    </div>

                    <form onSubmit={onSubmit} className="space-y-6">
                        {/* Grid: Company Name & Description */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Company Name</label>
                                <input 
                                    type="text" 
                                    name="name" 
                                    value={name} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-white"
                                    placeholder="e.g. Nexus"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Description</label>
                                <input 
                                    type="text" 
                                    name="description" 
                                    value={description} 
                                    onChange={onChange} 
                                    required
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-white"
                                    placeholder="e.g. a tech company"
                                />
                            </div>
                        </div>

                         {/* Grid: Website & Location */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Website</label>
                                <input 
                                    type="text" 
                                    name="website" 
                                    value={website} 
                                    onChange={onChange} 
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-white"
                                    placeholder="e.g. www.nexus.com"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-slate-700 mb-2">Location</label>
                                <input 
                                    type="text" 
                                    name="location" 
                                    value={location} 
                                    onChange={onChange} 
                                    required 
                                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition bg-white"
                                    placeholder="e.g. Pune"
                                />
                            </div>
                        </div>

                        {/* Logo Upload */}
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Logo</label>
                            <div className="flex items-center border border-slate-200 rounded-lg p-1 bg-white">
                                <label htmlFor="logo-upload" className="cursor-pointer bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-medium hover:bg-slate-200 transition">
                                    Choose File
                                </label>
                                <span className="ml-4 text-slate-500 truncate">{logoFile ? logoFile.name : 'No file chosen'}</span>
                                <input 
                                    id="logo-upload" 
                                    type="file" 
                                    accept="image/*" 
                                    onChange={handleFileChange}
                                    className="hidden"
                                />
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md disabled:opacity-70"
                        >
                            {loading ? 'Creating...' : 'Update'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default AddCompany;