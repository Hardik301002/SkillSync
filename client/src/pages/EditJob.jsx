import React, { useState, useEffect } from 'react';
import API from '../api/axios';
import { useNavigate, useParams } from 'react-router-dom';

const EditJob = () => {
    const { id } = useParams(); // Job ID
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        title: '', company: '', location: '', salary: '', description: '', requiredSkills: ''
    });

    const { title, company, location, salary, description, requiredSkills } = formData;

    // 1. Fetch Existing Data
    useEffect(() => {
        const fetchJob = async () => {
            const token = localStorage.getItem('token');
            try {
                const config = { headers: { 'x-auth-token': token } };
                const res = await API.get(`/jobs/${id}`, config);
                
                // Pre-fill form (Convert skills array back to string)
                setFormData({
                    ...res.data,
                    requiredSkills: res.data.requiredSkills.join(', ')
                });
                setLoading(false);
            } catch (err) {
                alert("Error fetching job");
                navigate('/dashboard');
            }
        };
        fetchJob();
    }, [id, navigate]);

    const onChange = e => setFormData({ ...formData, [e.target.name]: e.target.value });

    // 2. Submit Updates
    const onSubmit = async e => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            const config = { headers: { 'x-auth-token': token } };
            
            await API.put(`/jobs/${id}`, formData, config);
            
            alert('Job Updated Successfully!');
            navigate(`/jobs/${id}`); // Go back to details page
        } catch (err) {
            console.error(err);
            alert('Error updating job');
        }
    };

    if (loading) return <div className="text-center mt-20">Loading...</div>;

    return (
        <div className="min-h-screen bg-[#f8fcfc] font-sans text-gray-800 p-10">
            <button onClick={() => navigate(`/jobs/${id}`)} className="text-[#6366f1] font-bold mb-6 hover:underline">
                &larr; Cancel & Back
            </button>

            <div className="max-w-2xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
                <h2 className="text-3xl font-bold text-[#2c1e6d] mb-6">Edit Job</h2>
                
                <form onSubmit={onSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Job Title</label>
                        <input type="text" name="title" value={title} onChange={onChange} required className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#6366f1] outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Company</label>
                        <input type="text" name="company" value={company} onChange={onChange} required className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#6366f1] outline-none" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Location</label>
                            <input type="text" name="location" value={location} onChange={onChange} required className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#6366f1] outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Salary</label>
                            <input type="text" name="salary" value={salary} onChange={onChange} required className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#6366f1] outline-none" />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Required Skills</label>
                        <input type="text" name="requiredSkills" value={requiredSkills} onChange={onChange} required className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#6366f1] outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                        <textarea name="description" value={description} onChange={onChange} required rows="4" className="w-full p-3 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-[#6366f1] outline-none"></textarea>
                    </div>

                    <button type="submit" className="w-full bg-[#2c1e6d] text-white py-3 rounded-xl font-bold hover:bg-[#1a1145] transition shadow-md">
                        💾 Save Changes
                    </button>
                </form>
            </div>
        </div>
    );
};

export default EditJob;