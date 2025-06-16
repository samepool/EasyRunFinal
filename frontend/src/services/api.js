import axios from 'axios';
const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
});

API.interceptors.request.use(config => {
    const authData = localStorage.getItem('auth');
    let token = null;
    if (authData) {
        try {
            const parsedAuth = JSON.parse(authData);
            token = parsedAuth.token;
        } catch (e) {
            console.error("Failed to parse auth data from localStorage:", e);
            localStorage.removeItem('auth');
        }
    }

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

export default API;