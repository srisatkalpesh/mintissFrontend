import axios from 'axios'; // import from axios package directly

const instance = axios.create({
    baseURL: process.env.VUE_APP_API_BASE_URL,
});

console.log('Axios instance created with base URL:', instance.defaults.baseURL);
// Add Authorization header if token exists
instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Handle 401 Unauthorized globally
instance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401) {
            // Don't redirect if we're already on the login page
            if (!window.location.pathname.includes('/login')) {
                localStorage.removeItem('user');
                localStorage.removeItem('token');
                window.location.href = '/login';
            }
        }
        return Promise.reject(error);
    }
);

export default instance;
