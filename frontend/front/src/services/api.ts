import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:8080',
    timeout: 10000,
    withCredentials: true,
    // Se ativou o CSRF da Opção 2 anterior, mantenha estas linhas:
    // xsrfCookieName: 'XSRF-TOKEN',
    // xsrfHeaderName: 'X-XSRF-TOKEN'
});

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (typeof window !== 'undefined' && error.response) {
            const status = error.response.status;

            if (status === 401 || status === 403) {
                
                localStorage.removeItem('usuarioGestus');
                if (window.location.pathname !== '/login') {
                    window.location.href = '/login';
                }
            } 
        }
        
        return Promise.reject(error);
    }
);