import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { refreshToken } from "@/api/authService";

export function useAuth() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    async function checkAuth() {
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
            setIsAuthenticated(false);
            setLoading(false);
            return;
        }

        try {
            const decoded = jwtDecode(accessToken);
            const now = Date.now() / 1000;
            if (decoded.exp && decoded.exp < now) {
                try {
                    await refreshToken();
                    setIsAuthenticated(true);
                } catch {
                    setIsAuthenticated(false);
                }
            } else {
                setIsAuthenticated(true)
            }
        } catch {
            setIsAuthenticated(false);
        }
        setLoading(false);
    }

    useEffect(() => {
        checkAuth();
    }, []);

    return { isAuthenticated, loading, checkAuth }
}
