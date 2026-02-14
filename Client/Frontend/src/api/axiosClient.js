import axios from 'axios';

const axiosClient = axios.create({
    // baseURL: import.meta.env.VITE_API_URL || 'https://yojanasetu-hsmd.onrender.com/api/v1',
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosClient.interceptors.request.use((config) => {
    const token = localStorage.getItem('accessToken'); 
    
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default axiosClient;