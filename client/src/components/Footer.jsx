import React from 'react';
import { useNavigate } from 'react-router-dom';

const Footer = () => {
    const navigate = useNavigate();

    return (
        <footer className="bg-[#1a1145] text-slate-300 py-12 border-t border-indigo-900 mt-auto">
            <div className="max-w-7xl mx-auto px-6 md:px-10">
                
                {/*  GRID LAYOUT: Puts Brand, Candidates, Recruiters, and Support in one line */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
                    
                    {/* Column 1: Brand & Socials */}
                    <div className="space-y-4">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center text-white font-bold text-xl shadow-lg">S</div>
                            <span className="text-2xl font-extrabold text-white tracking-tight">SkillSync</span>
                        </div>
                        <p className="text-sm text-slate-400 leading-relaxed">
                            Connecting top talent with the world's best companies. Your dream career starts here.
                        </p>
                    </div>

                    {/* Column 2: For Candidates */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">For Candidates</h3>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => navigate('/jobs')} className="hover:text-white hover:translate-x-1 transition-all duration-200">Browse Jobs</button></li>
                            <li><button onClick={() => navigate('/dashboard')} className="hover:text-white hover:translate-x-1 transition-all duration-200">Candidate Dashboard</button></li>
                            <li><button onClick={() => navigate('/saved-jobs')} className="hover:text-white hover:translate-x-1 transition-all duration-200">Saved Jobs</button></li>
                            <li><button onClick={() => navigate('/applications')} className="hover:text-white hover:translate-x-1 transition-all duration-200">My Applications</button></li>
                        </ul>
                    </div>

                    {/* Column 3: For Recruiters */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">For Recruiters</h3>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => navigate('/post-job')} className="hover:text-white hover:translate-x-1 transition-all duration-200">Post a Job</button></li>
                            <li><button onClick={() => navigate('/dashboard')} className="hover:text-white hover:translate-x-1 transition-all duration-200">Recruiter Dashboard</button></li>
                            <li><button onClick={() => navigate('/registered-companies')} className="hover:text-white hover:translate-x-1 transition-all duration-200">Manage Companies</button></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-200">Pricing Plans</a></li>
                        </ul>
                    </div>

                    {/* Column 4: Support */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6">Support</h3>
                        <ul className="space-y-3 text-sm">
                            <li><button onClick={() => navigate('/about')} className="hover:text-white hover:translate-x-1 transition-all duration-200">About Us</button></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-200">Contact Support</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-200">Privacy Policy</a></li>
                            <li><a href="#" className="hover:text-white hover:translate-x-1 transition-all duration-200">Terms of Service</a></li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-8 border-t border-indigo-900/50 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
                    <p>© 2026 SkillSync Inc. All rights reserved.</p>
                    <div className="flex gap-6">
                        <span>Made with ❤️ in India</span>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;