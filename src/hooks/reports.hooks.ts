"use client";

import { useState, useCallback } from "react";
import { getPendingReports } from "@/services/report.service";
import { ReportDto } from "@/types/report.dto";
import { useAdminLogin } from "./auth.hooks";

export function usePendingReports() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reports, setReports] = useState<ReportDto[] | null>(null);
  const { executeRefresh } = useAdminLogin();

  const fetchReports = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const refreshSuccess = await executeRefresh();
      if (!refreshSuccess) {
        return;
      }
      
      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await getPendingReports(accessToken);
      setReports(response);
    } catch (err: any) {
      if (err.response?.status === 401) {
        setError("No autorizado por jwt.");
      } else {
        setError("Error al obtener reportes pendientes.");
      }
      setReports(null);
    } finally {
      setIsLoading(false);
    }
  }, [executeRefresh]);


  return {
    isLoading,
    error,
    reports,
    fetchReports,
  };
}
