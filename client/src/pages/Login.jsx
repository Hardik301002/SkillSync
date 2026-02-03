import React, { useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Login = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const { email, password } = formData;

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async e => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await API.post('/login', formData);
            const userObj = {
                ...res.data, // This spreads ALL fields: name, email, bio, skills, resume, avatar
                token: undefined // We store token separately usually, but removing it from user object is cleaner
            };

            localStorage.setItem('token', res.data.token);
            localStorage.setItem('user', JSON.stringify(userObj)); 

            toast.success("Login Successful! 🚀");
            
            // Redirect based on Role
             if (res.data.role === 'recruiter') {
             navigate('/dashboard');
            } else {
             navigate('/dashboard');
            }

        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || "Invalid Credentials";
            toast.error(errorMsg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900 flex flex-col">
            
            {/* Navbar */}
            <nav className="bg-white/80 backdrop-blur-md shadow-sm px-6 md:px-10 py-4 flex justify-between items-center sticky top-0 z-50 border-b border-gray-200">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                     <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl">S</div>
                     <h1 className="text-2xl font-extrabold text-slate-800 tracking-tight">SkillSync</h1>
                </div>
                
                <button 
                    onClick={() => navigate('/register')} 
                    className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700 transition shadow-md shadow-indigo-200"
                >
                    Sign Up
                </button>
            </nav>

            {/* Login Card */}
            <div className="flex-grow flex items-center justify-center p-6">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                    
                    <div className="bg-indigo-50 p-8 text-center border-b border-indigo-100">
                        <h2 className="text-3xl font-extrabold text-[#2c1e6d] mb-2">Welcome Back</h2>
                        <p className="text-slate-500">Login to access your dashboard</p>
                    </div>

                    <form onSubmit={onSubmit} className="p-8 space-y-6">
                        
                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
                            <input 
                                type="email" 
                                name="email" 
                                value={email} 
                                onChange={onChange} 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-slate-700 mb-2">Password</label>
                            <input 
                                type="password" 
                                name="password" 
                                value={password} 
                                onChange={onChange} 
                                required 
                                className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition bg-slate-50 focus:bg-white"
                                placeholder="••••••••"
                            />
                        </div>

                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full bg-[#2c1e6d] text-white py-3.5 rounded-xl font-bold text-lg hover:bg-[#1a1145] transition shadow-lg transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed mt-4"
                        >
                            {loading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className="px-8 pb-8 text-center">
                        <p className="text-slate-500 text-sm">
                            Don't have an account?{' '}
                            <button 
                                onClick={() => navigate('/register')} 
                                className="text-indigo-600 font-bold hover:underline"
                            >
                                Sign Up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;