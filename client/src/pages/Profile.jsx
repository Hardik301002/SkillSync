import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const rawUser = localStorage.getItem('user');
        if (rawUser) {
            setUser(JSON.parse(rawUser));
        } else {
            navigate('/login');
        }
    }, [navigate]);

    if (!user) return null;

    // HELPER: Extracts ONLY the filename (e.g., "image-123.png") 
    // This ignores "C:\Users\..." or "uploads\" prefixes entirely.
    const getFileUrl = (path) => {
        if (!path) return null;
        // Split by / or \ and take the last part
        const filename = path.split(/[/\\]/).pop();
        return `http://localhost:5000/uploads/${filename}`;
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
             {/* Navbar */}
             <nav className="bg-white/80 backdrop-blur-md shadow-sm px-10 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/dashboard')}>
                     <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                     <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">SkillSync</h1>
                </div>
                <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 text-white px-5 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition text-sm flex items-center gap-2">Dashboard</button>
            </nav>

            <div className="max-w-4xl mx-auto p-8">
                <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
                    {/* Header Banner */}
                    <div className="h-40 bg-gradient-to-r from-indigo-600 to-purple-600 relative"></div>
                    
                    <div className="px-8 pb-8">
                        <div className="relative flex justify-between items-end -mt-16 mb-6">
                            <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden shadow-lg bg-white relative group">
                                {/*  IMAGE DISPLAY */}
                                {user.avatar ? (
                                    <img 
                                        src={getFileUrl(user.avatar)} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover" 
                                        onError={(e) => {
                                            e.target.onerror = null; 
                                            e.target.src = "https://cdn-icons-png.flaticon.com/512/149/149071.png";
                                        }}
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center text-4xl">👤</div>
                                )}
                            </div>
                            <button 
                                onClick={() => navigate('/edit-profile')} 
                                className="bg-white text-indigo-600 border border-indigo-200 px-6 py-2 rounded-lg font-bold hover:bg-indigo-50 transition shadow-sm"
                            >
                                Edit Profile
                            </button>
                        </div>

                        <div className="mb-8">
                            <h1 className="text-3xl font-extrabold text-[#2c1e6d] mb-1">{user.name}</h1>
                            <p className="text-slate-500 font-medium">{user.email}</p>
                            <p className="mt-4 text-gray-600 leading-relaxed max-w-2xl">{user.bio || "No bio added yet."}</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-gray-100 pt-8">
                            {/* Skills */}
                            <div>
                                <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {user.skills && user.skills.length > 0 ? (
                                        user.skills.map((skill, index) => (
                                            <span key={index} className="bg-indigo-50 text-indigo-700 px-3 py-1 rounded-full text-sm font-bold">
                                                {skill}
                                            </span>
                                        ))
                                    ) : (
                                        <p className="text-gray-400 italic">No skills listed.</p>
                                    )}
                                </div>
                            </div>

                            {/* Resume */}
                            {user.role === 'user' && (
                                <div>
                                    <h3 className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-4">Resume</h3>
                                    {user.resume ? (
                                        <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-xl border border-slate-200">
                                            <div className="text-3xl">📄</div>
                                            <div>
                                                <p className="font-bold text-slate-700">My Resume.pdf</p>
                                                {/*  RESUME DOWNLOAD LINK */}
                                                <a 
                                                    href={getFileUrl(user.resume)} 
                                                    target="_blank" 
                                                    rel="noreferrer"
                                                    className="text-indigo-600 text-sm font-bold hover:underline"
                                                >
                                                    View / Download
                                                </a>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="p-4 border border-dashed border-gray-300 rounded-xl text-center text-gray-400">
                                            No resume uploaded.
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;