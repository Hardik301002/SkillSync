import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const RegisteredCompanies = () => {
    const [companies, setCompanies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const rawUser = localStorage.getItem('user');
    const user = rawUser ? JSON.parse(rawUser) : null;

    useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem('token');
                const config = { headers: { 'x-auth-token': token } };
                //  Fetch companies from the new API endpoint
                const res = await API.get('/companies', config);
                setCompanies(res.data);
            } catch (err) {
                console.error("Error fetching companies", err);
                toast.error("Failed to load companies");
            } finally {
                setLoading(false);
            }
        };
        fetchCompanies();
    }, []);

    const filteredCompanies = companies.filter(company =>
        company.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Helper to display company logo or placeholder
    const CompanyLogo = ({ company, className }) => {
        const logoUrl = company.logo ? `http://localhost:5000/${company.logo.replace(/\\/g, '/')}` : null;
        if (logoUrl) {
            return <img src={logoUrl} alt={`${company.name} logo`} className={`object-contain ${className}`} />;
        }
        return (
            <div className={`bg-indigo-100 text-indigo-600 flex items-center justify-center font-bold text-lg ${className}`}>
                {company.name.charAt(0).toUpperCase()}
            </div>
        );
    };

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-slate-50"><div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div></div>;

    return (
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
            {/* Navbar - Matching the style from the image */}
            <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-sm border-b border-slate-200 px-6 md:px-10 py-4 flex justify-between items-center">
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
            </nav>

            <div className="max-w-7xl mx-auto p-6 md:p-10">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    {/* Search bar */}
                    <div className="relative w-full md:w-80">
                         <input 
                            type="text" 
                            placeholder="Search for company..." 
                            value={searchTerm} 
                            onChange={(e) => setSearchTerm(e.target.value)} 
                            className="w-full pl-4 pr-10 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white transition-all"
                        />
                    </div>
                    {/* "Add new company" button */}
                    <button onClick={() => navigate('/add-company')} className="bg-[#6366f1] text-white px-4 py-2 rounded-lg font-bold hover:bg-indigo-700 shadow-md transition text-sm">
                        Add new company
                    </button>
                </div>

                {/* Company Table - Matching the style from the image */}
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-100 text-slate-500 text-sm font-medium">
                                    <th className="px-6 py-4">Logo</th>
                                    <th className="px-6 py-4">Name</th>
                                    <th className="px-6 py-4">Location</th>
                                    <th className="px-6 py-4">website</th>
                                    <th className="px-6 py-4">Date</th>
                                    <th className="px-6 py-4 text-center">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-50">
                                {filteredCompanies.length === 0 ? (
                                    <tr><td colSpan="6" className="text-center py-12 text-slate-400 font-medium">No companies found.</td></tr>
                                ) : (
                                    filteredCompanies.map((company) => (
                                        <tr key={company._id} className="hover:bg-slate-50/50 transition">
                                            {/* Logo */}
                                            <td className="px-6 py-4">
                                                <CompanyLogo company={company} className="w-8 h-8 rounded-full" />
                                            </td>
                                            
                                            <td className="px-6 py-4 font-bold text-slate-900">{company.name}</td>
                                            <td className="px-6 py-4 text-slate-700 font-medium">{company.location}</td>
                                            <td className="px-6 py-4 text-slate-600 font-medium">
                                                {company.website ? (
                                                    <a href={company.website.startsWith('http') ? company.website : `https://${company.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-indigo-600 hover:underline">
                                                        {company.website}
                                                    </a>
                                                ) : '-'}
                                            </td>
                                            <td className="px-6 py-4 text-slate-500 font-medium">
                                                {new Date(company.createdAt).toISOString().split('T')[0]}
                                            </td>
                                            
                                            {/* Action (Three dots) - For now, we can make it a link to edit */}
                                            <td className="px-6 py-4 text-center text-2xl text-slate-400 cursor-pointer hover:text-slate-600 leading-none">
                                                <button onClick={() => navigate(`/edit-company/${company._id}`)}>...</button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="text-center mt-4 text-slate-400 text-sm">A list of your recent registered companies</div>
            </div>
        </div>
    );
};

export default RegisteredCompanies;