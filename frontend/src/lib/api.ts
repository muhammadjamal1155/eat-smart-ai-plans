const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const getApiUrl = (endpoint: string) => {
    // Handle leading/trailing slashes to avoid double slashes
    const base = API_BASE_URL.replace(/\/$/, '');
    const path = endpoint.replace(/^\//, '');
    return `${base}/${path}`;
};

export default API_BASE_URL;
