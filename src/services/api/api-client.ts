'use client';

import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const BASE_URL: string = process.env.NEXT_PUBLIC_BASE_URL || '';

// 🔒 API untuk endpoint yang butuh token
const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    }
});

// Fungsi untuk ambil token dari URL params
const getTokenFromUrl = (): string | null => {
    if (typeof window === 'undefined') return null;
    
    const params = new URLSearchParams(window.location.search);
    return params.get('token');
};

// Interceptor untuk menambahkan token
apiClient.interceptors.request.use((config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
        // Cek token dari URL params terlebih dahulu
        let token = getTokenFromUrl();
        
        // Jika tidak ada di URL, cek di localStorage
        if (!token) {
            const auth = localStorage.getItem('auth');
            const tokens = auth ? JSON.parse(auth) : null;
            token = tokens?.authToken;
        };

        if (token) {
            config.headers = config.headers || {};
            config.headers.Authorization = token;
        };
    }
    return config;
});

export { apiClient };
