import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { WeeklyReportsResponse } from "@/types/reports.types";


const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export function useWeeklyReportsApi() {
  const { accessToken, refreshTokenFunc } = useAuth();

  const getWeeklyReports = useCallback(async () => {
    try {
      const response = await axios.get<WeeklyReportsResponse[]>(
        `${BASE_URL}/v1/reports/weekly`,
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
        const retryResponse = await axios.get<WeeklyReportsResponse[]>(
          `${BASE_URL}/v1/reports/weekly`,
          { headers: { Authorization: `Bearer ${newAccessToken}` } }
        );
        return retryResponse.data;
      }
      throw error;
    }
  }, [accessToken, refreshTokenFunc]);

  return { getWeeklyReports };
}