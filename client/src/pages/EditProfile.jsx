import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const EditProfile = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [name, setName] = useState('');
    const [skills, setSkills] = useState('');
    const [bio, setBio] = useState('');
    
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState(null);
    const [resumeFile, setResumeFile] = useState(null);
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
            const user = JSON.parse(rawUser);
            setCurrentUser(user);
            setName(user.name || '');
            setSkills(user.skills ? user.skills.join(', ') : '');
            setBio(user.bio || '');
            
            //  Extract ONLY the filename (Matches Profile.jsx logic)
            if (user.avatar) {
                const filename = user.avatar.split(/[/\\]/).pop();
                setAvatarPreview(`http://localhost:5000/uploads/${filename}`);
            }
        } else {
            navigate('/login');
        }
    }, [navigate]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setAvatarFile(file);
            setAvatarPreview(URL.createObjectURL(file));
        }
    };

    const handleResumeChange = (e) => {
        const file = e.target.files[0];
        if (file && file.type !== 'application/pdf') {
            toast.error("Please upload a PDF file for your resume.");
            return;
        }
        setResumeFile(file);
    };

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);
        
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token, 'Content-Type': 'multipart/form-data' } };

            const formData = new FormData();
            formData.append('name', name);
            formData.append('skills', skills);
            formData.append('bio', bio);
            if (avatarFile) formData.append('avatar', avatarFile);
            if (resumeFile) formData.append('resume', resumeFile);

            const res = await API.put('/profile', formData, config);
            
            localStorage.setItem('user', JSON.stringify(res.data));
            toast.success("Profile updated successfully!");
            navigate('/profile'); 

        } catch (err) {
            console.error(err);
            toast.error("Error updating profile");
        } finally {
            setLoading(false);
        }
    };

    if (!currentUser) return null;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
             <nav className="bg-white/80 backdrop-blur-md shadow-sm px-10 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                     <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                     <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">SkillSync</h1>
                </div>
            </nav>

            <div className="max-w-2xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-2xl border border-gray-100">
                <h2 className="text-3xl font-bold text-[#2c1e6d] mb-8 text-center">Edit Profile</h2>

                <form onSubmit={onSubmit} className="space-y-6">
                    {/* Avatar */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-indigo-50 mb-4 bg-gray-100 flex items-center justify-center relative group shadow-sm">
                            {avatarPreview ? (
                                <img 
                                    src={avatarPreview} 
                                    alt="Avatar" 
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.onerror = null; 
                                        e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                    }}
                                />
                            ) : (
                                <span className="text-4xl">👤</span>
                            )}
                            <label className="absolute inset-0 bg-black/40 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition cursor-pointer">
                                📷
                                <input type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
                            </label>
                        </div>
                        <p className="text-sm text-gray-400">Tap image to change</p>
                    </div>

                    {/* Resume */}
                    {currentUser.role === 'user' && (
                        <div className="bg-indigo-50 p-6 rounded-xl border border-indigo-100">
                            <label className="block text-[#2c1e6d] font-bold mb-2">Upload Resume (PDF)</label>
                            <div className="flex items-center gap-4">
                                <input type="file" accept=".pdf" onChange={handleResumeChange} className="block w-full text-sm text-gray-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-bold file:bg-[#6366f1] file:text-white hover:file:bg-[#4f46e5] cursor-pointer" />
                            </div>
                            {currentUser.resume && !resumeFile && <p className="text-xs text-green-600 mt-2 font-bold">✓ Current resume on file</p>}
                        </div>
                    )}

                    {/* Basic Info */}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Full Name</label>
                        <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]" />
                    </div>
                    {currentUser.role === 'user' && (
                        <div>
                            <label className="block text-gray-700 font-bold mb-2">Skills</label>
                            <input type="text" value={skills} onChange={(e) => setSkills(e.target.value)} className="w-full p-3 border border-gray-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]" placeholder="e.g. React, Node.js" />
                        </div>
                    )}
                    <div>
                        <label className="block text-gray-700 font-bold mb-2">Bio</label>
                        <textarea value={bio} onChange={(e) => setBio(e.target.value)} rows="3" className="w-full p-3 border border-gray-200 rounded-xl bg-slate-50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]"></textarea>
                    </div>

                    <div className="flex gap-4 pt-4">
                        <button type="button" onClick={() => navigate('/profile')} className="flex-1 py-3 rounded-xl font-bold text-gray-500 hover:bg-gray-100 transition">Cancel</button>
                        <button type="submit" disabled={loading} className="flex-[2] bg-[#6366f1] text-white py-3 rounded-xl font-bold hover:bg-[#4f46e5] transition shadow-lg">
                            {loading ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditProfile;