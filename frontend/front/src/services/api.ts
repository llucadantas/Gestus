import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined') {
            
            if (error.response) {
                const status = error.response.status;

                
            } 
            
            
        }
        
        return Promise.reject(error);
    }
);