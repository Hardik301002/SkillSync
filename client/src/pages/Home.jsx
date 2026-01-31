import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api/axios';
import CompanyLogo from '../components/CompanyLogo'; 
import Footer from '../components/Footer';

const Home = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState(''); 

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                setLoading(true);
                const endpoint = searchTerm 
                    ? `/public-jobs?search=${searchTerm}` 
                    : '/public-jobs';
                
                const res = await API.get(endpoint);
                setJobs(res.data);
            } catch (err) {
                console.error("Error fetching public jobs");
            } finally {
                setLoading(false);
            }
        };
        const delayDebounceFn = setTimeout(() => {
            fetchJobs();
        }, 500);
        return () => clearTimeout(delayDebounceFn);
    }, [searchTerm]);

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* 1. GLASSMORPHISM NAVBAR */}
            <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200 px-6 md:px-10 py-4 flex justify-between items-center transition-all">
                <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer">S</div>
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer">SkillSync</span>
                </div>
                
                <div className="hidden md:flex gap-8 items-center font-medium text-slate-600">
                    <Link to="/" className="text-indigo-600 font-bold hover:text-indigo-700 transition">Home</Link>
                    <a href="#jobs" className="hover:text-indigo-600 transition">Browse Jobs</a>
                    <Link to="/about" className="hover:text-indigo-600 transition">About Us</Link>
                </div>

                <div className="flex gap-3 items-center">
                    <button onClick={() => navigate('/about')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95">About Us</button>
                    <button onClick={() => navigate('/login')} className="bg-slate-200 text-slate-600 font-bold px-4 py-2 hover:bg-slate-300 rounded-lg transition">Login</button>
                    <button onClick={() => navigate('/register')} className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-bold hover:bg-indigo-700 shadow-lg shadow-indigo-200 transition-all transform active:scale-95">Sign Up</button>
                </div>
            </nav>

            {/* 2. HERO SECTION */}
            <header className="relative pt-20 pb-24 px-6 text-center overflow-hidden">
                {/* Background Decor */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-100/50 rounded-full blur-3xl -z-10"></div>

                <div className="max-w-4xl mx-auto">
                    <span className="inline-block py-1 px-3 rounded-full bg-indigo-50 text-indigo-600 text-xs font-bold uppercase tracking-wider mb-6 border border-indigo-100">
                        The #1 Platform for Tech Talent
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-slate-900 mb-6 tracking-tight leading-tight">
                        Find the job that <br className="hidden md:block" />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">fits your life</span>
                    </h1>
                    <p className="text-slate-500 text-lg md:text-xl mb-10 max-w-2xl mx-auto leading-relaxed">
                        Connect with top companies like Google, Amazon, and Netflix. Your next career move is just one search away.
                    </p>

                    {/* Floating Search Bar */}
                    <div className="max-w-2xl mx-auto bg-white p-2 rounded-full shadow-xl shadow-slate-200/60 border border-slate-200 flex items-center transition-all focus-within:ring-4 focus-within:ring-indigo-100 focus-within:border-indigo-400">
                        <span className="pl-6 text-slate-400 text-xl"></span>
                        <input 
                            type="text" 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by Title, Company, or Skill..." 
                            className="flex-1 px-4 py-3 bg-transparent focus:outline-none text-slate-700 text-lg placeholder-slate-400"
                        />
                        <button className="bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition shadow-md">
                            Find Job
                        </button>
                    </div>

                    {/* Tags */}
                    <div className="mt-8 flex flex-wrap justify-center gap-2">
                        {['Remote', 'React', 'Google', 'Design', 'Backend'].map((tag) => (
                            <button 
                                key={tag} 
                                onClick={() => setSearchTerm(tag)}
                                className="px-4 py-1.5 rounded-full bg-white border border-slate-200 text-slate-500 text-sm font-medium hover:border-indigo-300 hover:text-indigo-600 transition shadow-sm"
                            >
                                {tag}
                            </button>
                        ))}
                    </div>
                </div>
            </header>

            {/* 3. JOB LISTINGS GRID */}
            <section id="jobs" className="max-w-7xl mx-auto px-6 py-16">
                <div className="text-center max-w-7xl mx-auto px-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">
                            {searchTerm ? `Results for "${searchTerm}"` : 'Latest Opportunities'}
                        </h2>
                        <p className="text-slate-500 mt-2">Hand-picked jobs for you.</p>
                    </div>
                </div>
                <br />
                
                {loading ? (
                    <div className="flex justify-center py-20">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : jobs.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl border border-dashed border-slate-300">
                        <p className="text-xl font-medium text-slate-400">No jobs found.</p>
                        <button onClick={() => setSearchTerm('')} className="mt-2 text-indigo-600 font-bold hover:underline">Clear Search</button>
                    </div>
                ) : (

                    <div className="grid grid-cols-3 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {jobs.map(job => (
                            <div key={job._id} className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:shadow-xl hover:border-indigo-100 transition-all duration-300 group flex flex-col justify-between h-full">
                                <div>
                                    <div className="flex items-start justify-between mb-4">
                                        <CompanyLogo company={job.company} className="w-12 h-12 rounded-lg" />
                                        <span className="bg-indigo-50 text-indigo-700 text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider">Active</span>
                                    </div>
                                    
                                    <h3 className="text-lg font-bold text-slate-900 mb-1 group-hover:text-indigo-600 transition line-clamp-1">{job.title}</h3>
                                    <p className="text-slate-500 text-sm font-medium mb-4">{job.company} • {job.location}</p>
                                    
                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {(job.requiredSkills || []).slice(0,3).map((skill, i) => (
                                            <span key={i} className="text-xs bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 font-medium">{skill}</span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                                    <span className="text-slate-900 font-bold text-sm">{job.salary}</span>
                                    <button 
                                        onClick={() => navigate('/login')} 
                                        className="text-indigo-600 font-bold text-sm hover:underline flex items-center gap-1"
                                    >
                                        Apply Now <span>→</span>
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </section>
            <Footer />
        </div>
    );
};

export default Home;