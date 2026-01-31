import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-[#f8fcfc] font-sans text-gray-800">
            {/* Navbar */}
            <nav className="bg-white shadow-sm px-10 py-5 flex justify-between items-center sticky top-0 z-50">
                <div className="flex items-center gap-2" onClick={() => navigate('/')}>
                    <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center text-white font-bold text-xl cursor-pointer">S</div>
                    <span className="text-2xl font-extrabold text-slate-800 tracking-tight cursor-pointer">SkillSync</span>
                </div>
                <div className="flex gap-4">
                    <button onClick={() => navigate('/login')} className="text-[#6366f1] font-bold px-4 py-2 hover:bg-indigo-50 rounded-lg transition">Login</button>
                    <button onClick={() => navigate('/register')} className="bg-[#6366f1] text-white px-6 py-2 rounded-lg font-bold hover:bg-[#4f46e5] shadow-lg transition">Sign Up</button>
                </div>
            </nav>

            {/* Hero Section */}
            <header className="bg-[#2c1e6d] text-white py-24 text-center px-6">
                <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Bridging Talent with Opportunity</h1>
                <p className="text-xl text-indigo-100 max-w-2xl mx-auto mb-10">
                    SkillSync is the fastest-growing community for developers, designers, and tech professionals to find their dream roles.
                </p>
            </header>

            {/* Mission Section */}
            <section className="max-w-6xl mx-auto px-6 py-20 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h2 className="text-3xl font-bold text-[#2c1e6d] mb-6">Our Mission</h2>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                        We believe that job hunting shouldn't be a struggle. Our mission is to simplify the hiring process by using smart matching algorithms that connect skilled professionals with companies that value their talent.
                    </p>
                    <p className="text-gray-600 text-lg leading-relaxed">
                        Whether you are a fresh graduate or a senior engineer, SkillSync provides the tools you need to showcase your portfolio and land the offer.
                    </p>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100 relative">
                    {/* Decorative placeholder visual */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-[#6366f1] rounded-full opacity-10"></div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="text-center p-6 bg-indigo-50 rounded-xl">
                            <h3 className="text-3xl font-bold text-[#6366f1]">10k+</h3>
                            <p className="text-gray-500 font-medium">Active Jobs</p>
                        </div>
                        <div className="text-center p-6 bg-green-50 rounded-xl">
                            <h3 className="text-3xl font-bold text-green-600">500+</h3>
                            <p className="text-gray-500 font-medium">Companies</p>
                        </div>
                        <div className="text-center p-6 bg-blue-50 rounded-xl">
                            <h3 className="text-3xl font-bold text-blue-600">24h</h3>
                            <p className="text-gray-500 font-medium">Avg Response</p>
                        </div>
                        <div className="text-center p-6 bg-orange-50 rounded-xl">
                            <h3 className="text-3xl font-bold text-orange-600">Free</h3>
                            <p className="text-gray-500 font-medium">For Seekers</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Developer Section */}
            <section className="bg-white py-20 border-t border-gray-100">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-3xl font-bold text-[#2c1e6d] mb-10">Meet the Developer</h2>
                    <div className="bg-[#f8fcfc] p-8 rounded-2xl inline-block shadow-sm border border-gray-100">
                        <div className="w-24 h-24 rounded-full bg-indigo-100 mx-auto flex items-center justify-center text-4xl mb-4">👨‍💻</div>
                        <h3 className="text-xl font-bold text-[#2c1e6d]">Hardik Gupta</h3>
                        <p className="text-[#6366f1] font-medium mb-4">Full Stack MERN Developer</p>
                        <p className="text-gray-500 max-w-sm mx-auto">
                            "I built SkillSync to solve the problem of cluttered job boards. 
                            My goal is to create a seamless experience for both recruiters and candidates."
                        </p>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <div className="bg-[#6366f1] text-center py-16 px-6">
                <h2 className="text-3xl font-bold text-white mb-6">Ready to start your journey?</h2>
                <button onClick={() => navigate('/register')} className="bg-white text-[#6366f1] px-8 py-3 rounded-full font-bold shadow-lg hover:bg-gray-100 transition transform hover:scale-105">
                    Create Free Account
                </button>
            </div>
        </div>
    );
};

export default About;