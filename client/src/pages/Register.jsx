import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const Register = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'user', 
        skills: ''
    });

    const { name, email, password, role, skills } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/register', formData);
            
            localStorage.setItem('token', res.data.token);
            
            const userObj = {
                _id: res.data._id,
                name: res.data.name,
                email: res.data.email,
                role: res.data.role, 
                skills: res.data.skills
            };
            localStorage.setItem('user', JSON.stringify(userObj));

            toast.success(`Welcome, ${res.data.name}!`);
            window.location.href = '/dashboard';

        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Registration Failed";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8fcfc] font-sans text-gray-800">
            <div className="bg-white p-10 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-[#2c1e6d] mb-2">SkillSync</h1>
                    <p className="text-gray-500">Create an account to get started</p>
                </div>

                <form onSubmit={onSubmit} className="space-y-5">
                    
                    {/*  ROLE SELECTION DROPDOWN */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">I am a...</label>
                        <select 
                            name="role" 
                            value={role} 
                            onChange={onChange} 
                            className="w-full p-3 border border-gray-200 rounded-xl bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-[#6366f1] transition font-bold text-[#2c1e6d]"
                        >
                            <option value="user">Job Seeker (Candidate)</option>
                            <option value="recruiter">Recruiter (Hiring Manager)</option>
                        </select>
                    </div>

                    {/* Full Name */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Full Name</label>
                        <input type="text" name="name" value={name} onChange={onChange} required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]" placeholder="John Doe" />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                        <input type="email" name="email" value={email} onChange={onChange} required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]" placeholder="you@example.com" />
                    </div>

                    {/* Password */}
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-2">Password</label>
                        <input type="password" name="password" value={password} onChange={onChange} required className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]" placeholder="••••••••" />
                    </div>

                    {/* Skills (Only show if Job Seeker) */}
                    {role === 'user' && (
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Top Skills (Comma Separated)</label>
                            <input type="text" name="skills" value={skills} onChange={onChange} className="w-full p-3 border border-gray-200 rounded-xl bg-gray-50 focus:outline-none focus:ring-2 focus:ring-[#6366f1]" placeholder="React, Node.js, Python" />
                        </div>
                    )}

                    <button type="submit" disabled={loading} className="w-full bg-[#2c1e6d] text-white py-3 rounded-xl font-bold text-lg hover:bg-[#1a1145] transition shadow-lg transform active:scale-95 mt-4">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className="text-center mt-6 text-gray-500">
                    Already have an account? <Link to="/login" className="text-[#6366f1] font-bold hover:underline">Login</Link>
                </p>
            </div>
        </div>
    );
};

export default Register;