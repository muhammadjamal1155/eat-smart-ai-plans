import { supabase } from './supabase';

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export const getApiUrl = (endpoint: string) => {
    // Handle leading/trailing slashes to avoid double slashes
    const base = API_BASE_URL.replace(/\/$/, '');
    const path = endpoint.replace(/^\//, '');
    return `${base}/${path}`;
};

export const fetchWithAuth = async (url: string, options: RequestInit = {}) => {
    const { data: { session } } = await supabase.auth.getSession();
    const headers = new Headers(options.headers || {});
    if (session?.access_token) {
        headers.set('Authorization', `Bearer ${session.access_token}`);
    }
    return fetch(url, { ...options, headers });
};

export default API_BASE_URL;
