import axios from 'axios';

// Automatically detect if we are on localhost or deployed
const isDevelopment = import.meta.env.MODE === 'development';

const API = axios.create({
    baseURL: isDevelopment 
        ? 'http://localhost:5000/api/v1' 
        : 'https://skillsync-1ppr.onrender.com/api/v1' 
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers['x-auth-token'] = localStorage.getItem('token');
    }
    return req;
});

export default API;