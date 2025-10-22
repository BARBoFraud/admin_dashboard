import axios from "axios";
import { useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import type { DetailedReport } from "@/types/reportDetail.types";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

type EvaluateReportBody = {
  reportId: number;
  statusId: number;
  riskId?: number;
};

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
    async (reportId: number, statusId: number, riskId?: number): Promise<void> => {
      const body: EvaluateReportBody = { reportId, statusId };
      if (riskId !== undefined && riskId !== null) body.riskId = riskId;
      try {
        await axios.patch(`${BASE_URL}/v1/reports/evaluate`, body, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
        return;
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) {
          await refreshTokenFunc();
          const newAccess = localStorage.getItem("accessToken");
          if (!newAccess) throw new Error("No autorizado");
          try {
            const retryBody: EvaluateReportBody = { reportId, statusId };
            if (riskId !== undefined && riskId !== null) retryBody.riskId = riskId;
            await axios.patch(`${BASE_URL}/v1/reports/evaluate`, retryBody, {
              headers: { Authorization: `Bearer ${newAccess}` },
            });
            return;
          } catch (err) {
            console.error("Error retrying report evaluation", err);
          }
        }
        throw err;
      }
    },
    [accessToken, refreshTokenFunc]
  );

  return { getReportDetail, evaluateReport };
}
