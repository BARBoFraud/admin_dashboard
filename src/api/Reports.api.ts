import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import axios from "axios";
import { ShortPendingReport } from "@/types/reports.types";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export function useReportsApi() {
  const { accessToken, refreshTokenFunc } = useAuth();

  const getPendingReports = useCallback(async () => {
    const response = await axios.get<ShortPendingReport[]>(
      `${BASE_URL}/v1/reports/pending`,
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (response.status === 401) {
      await refreshTokenFunc();
      return getPendingReports();
    }
    if (response.status !== 200) throw new Error("Failed to fetch pending reports");
    return response.data;
  }, [accessToken, refreshTokenFunc]);

  return { getPendingReports };
}