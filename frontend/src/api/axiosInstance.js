import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.response.use(
    (res) => res.data.data,
    (err) => {
        const message =
            err.response?.data?.message ||
            err.message ||
            "Something went wrong";

        return Promise.reject(message);
    }
);

export default api;
