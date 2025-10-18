import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { ShortPendingReport } from "@/types/reports.types";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export function useReportsApi() {
  const { accessToken, refreshTokenFunc } = useAuth();

  const getPendingReports = useCallback(async () => {
    try {
      const response = await axios.get<ShortPendingReport[]>(
        `${BASE_URL}/v1/reports/pending`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await refreshTokenFunc();
        
        const newAccessToken = localStorage.getItem("accessToken");
        
        if (!newAccessToken) {
          throw new Error("No se pudo refrescar el token");
        }
        
        const retryResponse = await axios.get<ShortPendingReport[]>(
          `${BASE_URL}/v1/reports/pending`,
          { headers: { Authorization: `Bearer ${newAccessToken}` } }
        );
        return retryResponse.data;
      }
      throw error;
    }
  }, [accessToken, refreshTokenFunc]);

  const getAcceptedReports = useCallback(async () => {
    try {
      const response = await axios.get<ShortPendingReport[]>(
        `${BASE_URL}/v1/reports/dashboard/accepted`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await refreshTokenFunc();
        const newAccessToken = localStorage.getItem("accessToken");
        if (!newAccessToken) {
          throw new Error("No se pudo refrescar el token");
        }
        const retryResponse = await axios.get<ShortPendingReport[]>(
          `${BASE_URL}/v1/reports/dashboard/accepted`,
          { headers: { Authorization: `Bearer ${newAccessToken}` } }
        );
        return retryResponse.data;
      }
      throw error;
    }
  }, [accessToken, refreshTokenFunc]);

  const getRejectedReports = useCallback(async () => {
    try {
      const response = await axios.get<ShortPendingReport[]>(
        `${BASE_URL}/v1/reports/dashboard/rejected`,
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 401) {
        await refreshTokenFunc();
        const newAccessToken = localStorage.getItem("accessToken");
        if (!newAccessToken) {
          throw new Error("No se pudo refrescar el token");
        }
        const retryResponse = await axios.get<ShortPendingReport[]>(
          `${BASE_URL}/v1/reports/dashboard/rejected`,
          { headers: { Authorization: `Bearer ${newAccessToken}` } }
        );
        return retryResponse.data;
      }
      throw error;
    }
  }, [accessToken, refreshTokenFunc]);

  return { getPendingReports, getAcceptedReports, getRejectedReports };
}