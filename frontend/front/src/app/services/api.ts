import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true
    
});
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            if (typeof window !== 'undefined') {
                localStorage.removeItem('usuarioGestus');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);
