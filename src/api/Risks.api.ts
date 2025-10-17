import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { CategoriesCountData } from "@/types/categories.types";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export function usePercentagesApi() {
  const { accessToken, refreshTokenFunc } = useAuth();

  const getRisksPercentages = useCallback(async () => {
    try {
      const response = await axios.get<CategoriesCountData[]>(
        `${BASE_URL}/v1/risk/counts`,
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
        const retryResponse = await axios.get<CategoriesCountData[]>(
          `${BASE_URL}/v1/risk/counts`,
          { headers: { Authorization: `Bearer ${newAccessToken}` } }
        );
        return retryResponse.data;
      }
      throw error;
    }
  }, [accessToken, refreshTokenFunc]);

  return { getRisksPercentages };
}