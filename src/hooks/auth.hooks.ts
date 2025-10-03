import { useState } from 'react';
import { adminLogin, adminLogout } from '../services/auth.service';
import { AdminLoginDto, AdminLoginResponse } from '../types/auth.dto';

interface UseAdminLoginReturn {
    isLoading: boolean;
    error: string | null;
    isLoggedIn: boolean;
    login: (credentials: AdminLoginDto) => Promise<void>;
    logout: () => void;
}

export function useAdminLogin(): UseAdminLoginReturn {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('accessToken') !== null;
        }
        return false;
    });

    const login = async (credentials: AdminLoginDto): Promise<void> => {
        setIsLoading(true);
        setError(null);

        try {
            const response: AdminLoginResponse = await adminLogin(credentials);
            localStorage.setItem('accessToken', response.accessToken);
            localStorage.setItem('refreshToken', response.refreshToken);
            setIsLoggedIn(true);
        } catch (err: any) {
            let errorMessage = 'Login failed. Please try again.';
            
            if (err.response?.status) {
                switch (err.response.status) {
                    case 401:
                        errorMessage = 'Invalid username or password';
                        break;
                    default:
                        errorMessage = `Login failed (${err.response.status}). Please try again.`;
                }
            }
            
            setError(errorMessage);
            setIsLoggedIn(false);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async (): Promise<void> => {
        try {
            const refreshToken = localStorage.getItem('refreshToken');
            if (refreshToken) {
                await adminLogout(refreshToken);
            }
        } catch (error) {
            console.error('Error during logout:', error);
        }
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        setIsLoggedIn(false);
        setError(null);
    };

    return {
        isLoading,
        error,
        isLoggedIn,
        login,
        logout
    };
}
