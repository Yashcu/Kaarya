import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
    headers: { 'Content-Type': 'application/json' },
});

function toApiError(err) {
    const message =
        err.response?.data?.message ||
        err.message ||
        'Something went wrong';

    const apiError = new Error(message);
    apiError.status = err.response?.status ?? null;
    apiError.errors = err.response?.data?.errors ?? [];
    apiError.data = err.response?.data ?? null;

    return apiError;
}

api.interceptors.response.use(
    (res) => res.data,
    (err) => Promise.reject(toApiError(err))
);

export default api;
