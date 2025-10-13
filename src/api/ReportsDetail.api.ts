import axios from "axios";
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { DetailedReport } from "@/types/reportDetail.types";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export function useReportsDetailApi() {
  const { accessToken, refreshTokenFunc } = useAuth();

  const getReportDetail = useCallback(
    async (id: number): Promise<DetailedReport> => {
      try {
        const res = await axios.get<DetailedReport>(`${BASE_URL}/v1/reports/${id}/dashboard`, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          await refreshTokenFunc();
          const newAccess = localStorage.getItem("accessToken");
          if (!newAccess) throw new Error("No autorizado");
          const retry = await axios.get<DetailedReport>(`${BASE_URL}/v1/reports/${id}/dashboard`, {
            headers: { Authorization: `Bearer ${newAccess}` },
          });
          return retry.data;
        }
        throw err;
      }
    },
    [accessToken, refreshTokenFunc]
  );

  const evaluateReport = useCallback(
    async (reportId: number, statusId: number): Promise<void> => {
      try {
        const res = await axios.patch( `${BASE_URL}/v1/reports/evaluate`, { reportId, statusId }, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return res.data;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          await refreshTokenFunc();
          const newAccess = localStorage.getItem("accessToken");
          if (!newAccess) throw new Error("No autorizado");
          const retry = await axios.patch( `${BASE_URL}/v1/reports/${reportId}/status`, { statusId }, {
            headers: { Authorization: `Bearer ${newAccess}` },
          });
          return retry.data;
        }
        throw err;
      }
    },
    [accessToken, refreshTokenFunc]
  );

  return { getReportDetail, evaluateReport };
}
