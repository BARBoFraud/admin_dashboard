"use client";
import { useState } from "react";
import {
  adminLogin,
  adminLogout,
  refreshToken,
} from "../services/auth.service";
import { AdminLoginDto, AdminLoginResponse } from "../types/auth.dto";
import { useRouter } from "next/navigation";

export function useAdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem("accessToken") !== null;
    }
    return false;
  });

  const login = async (credentials: AdminLoginDto): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const response: AdminLoginResponse = await adminLogin(credentials);
      localStorage.setItem("accessToken", response.accessToken);
      localStorage.setItem("refreshToken", response.refreshToken);
      setIsLoggedIn(true);
    } catch (err: any) {
      let errorMessage = "Login failed. Please try again.";

      if (err.response?.status) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Invalid username or password";
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
      const refreshToken = localStorage.getItem("refreshToken");
      if (refreshToken) {
        await adminLogout(refreshToken);
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setError(null);
  };

  const executeRefresh = async (): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const currentRefreshToken = localStorage.getItem("refreshToken");
      if (!currentRefreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await refreshToken(currentRefreshToken);
      localStorage.setItem("accessToken", response.accessToken);
      return true;
    } catch (err: any) {
      const errorMessage = "Token refresh failed. Redirecting to login.";
      setError(errorMessage);

      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setIsLoggedIn(false);

      router.push("/");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    isLoggedIn,
    login,
    logout,
    executeRefresh,
  };
}
