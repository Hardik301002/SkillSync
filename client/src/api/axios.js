import axios from 'axios';

// 1. Point to your Render Backend (Since it is Live and working)
// If you want to use your local backend instead, change this to 'http://localhost:5000/api/v1'
const API = axios.create({
    baseURL: '/api/v1',
    withCredentials: true 
});

// 2. Attach the Token to every request (Crucial for Profile/Jobs)
API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers.Authorization = `Bearer ${localStorage.getItem('token')}`;
    }
    return req;
});

export default API;