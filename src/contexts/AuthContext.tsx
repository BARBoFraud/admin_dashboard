"use client";

import { AdminProfile } from "@/types/admin.types";
import axios from "axios";
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

type Tokens = { accessToken: string; refreshToken: string };

type AuthContextType = {
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshTokenFunc: () => Promise<void>;
  setTokens: (tokens: Tokens) => void;
  getProfile: () => Promise<AdminProfile | null>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const accesTokenFromStorage = localStorage.getItem("accessToken");
    const refreshTokenFromStorage = localStorage.getItem("refreshToken");

    if (accesTokenFromStorage && refreshTokenFromStorage) {
      setAccessToken(accesTokenFromStorage);
      setRefreshToken(refreshTokenFromStorage);
    }

    setIsInitialized(true);
  }, []);

  const setTokens = useCallback((tokens: Tokens) => {
    if (tokens.accessToken && tokens.refreshToken) {
      localStorage.setItem("accessToken", tokens.accessToken);
      localStorage.setItem("refreshToken", tokens.refreshToken);
      setRefreshToken(tokens.refreshToken);
      setAccessToken(tokens.accessToken);
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      setAccessToken(null);
      setRefreshToken(null);
    }
  }, []);

  const clearTokens = useCallback(() => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    setAccessToken(null);
    setRefreshToken(null);
  }, []);

  const refreshTokenFunc = useCallback(async () => {
    const currentRefreshToken = localStorage.getItem("refreshToken");

    if (!currentRefreshToken) {
      console.warn("No refresh token available");
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/v1/auth/admins/refresh",
        {
          refreshToken: currentRefreshToken,
        },
      );

      if (response.status !== 201) {
        console.error("Refresh token failed with status:", response.status);
        clearTokens();
        return;
      }

      setTokens({
        accessToken: response.data.accessToken,
        refreshToken: currentRefreshToken,
      });
      console.log("Token refreshed successfully");
    } catch (error) {
      console.error("Error refreshing token:", error);
      clearTokens();
    }
  }, [clearTokens, setTokens]);

  const getProfile = useCallback(async (): Promise<AdminProfile | null> => {
    try {
      const response = await axios.get<AdminProfile>(
        "http://localhost:4000/v1/admins/profile",
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await refreshTokenFunc();
        const newAccessToken = localStorage.getItem("accessToken");
        if (!newAccessToken) {
          throw new Error("No se pudo refrescar el token");
        }
        const retryResponse = await axios.get<AdminProfile>(
          "http://localhost:4000/v1/admins/profile",
          {
            headers: { Authorization: `Bearer ${newAccessToken}` },
          },
        );
        return retryResponse.data;
      }
      throw error;
    }
  }, [accessToken, refreshTokenFunc]);

  const login = useCallback(
    async (username: string, password: string) => {
      try {
        const response = await axios.post(
          "http://localhost:4000/v1/auth/admins/login",
          {
            username,
            password,
          },
        );

        if (response.status === 401) {
          throw new Error("Credenciales inválidas");
        }
        if (response.status !== 201) {
          throw new Error("Error al iniciar sesión");
        }

        const tokens: Tokens = response.data as Tokens;
        setTokens(tokens);
      } catch (error) {
        if (axios.isAxiosError(error)) {
          if (error.response?.status === 401) {
            throw new Error("Credenciales inválidas");
          }
          if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
          }
        }
        throw error;
      }
    },
    [setTokens],
  );

  const logout = useCallback(async () => {
    const token = refreshToken;
    if (!token) {
      clearTokens();
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:4000/v1/auth/admins/logout",
        {
          refreshToken: token,
        },
      );

      if (response.status !== 201) {
        console.warn("Logout failed with status:", response.status);
      }
      console.log("Logout successful");
    } catch (error) {
      console.error("Error during logout:", error);
    } finally {
      clearTokens();
    }
  }, [refreshToken, clearTokens]);

  

  const value = useMemo<AuthContextType>(
    () => ({
      accessToken,
      refreshToken,
      isAuthenticated: accessToken !== null && isInitialized,
      login,
      logout,
      refreshTokenFunc,
      setTokens,
      getProfile,
    }),
    [
      accessToken,
      refreshToken,
      isInitialized,
      login,
      logout,
      refreshTokenFunc,
      setTokens,
      getProfile,
    ],
  );

  if (!isInitialized) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Cargando...</p>
      </div>
    );
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

