import axios from 'axios';

const API = axios.create({
    baseURL: 'https://skillsync-1ppr.onrender.com/api/v1'
});

API.interceptors.request.use((req) => {
    if (localStorage.getItem('token')) {
        req.headers['x-auth-token'] = localStorage.getItem('token');
    }
    return req;
});

export default API;