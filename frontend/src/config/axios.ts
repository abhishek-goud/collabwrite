import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true, // Enable cookie support
    headers: {
        'Content-Type': 'application/json',
    },
});


export default axiosInstance;