"use client";

import { ShortPendingReport } from "../../types/reports.types";
import { useEffect, useState } from "react";
import { Card } from "../ui/card";
import { useReportsApi } from "../../api/Reports.api";
import { FileX } from "lucide-react";

export default function ReportsRejected() {
  const [reports, setReports] = useState<ShortPendingReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getRejectedReports } = useReportsApi();

  useEffect(() => {
    const fetchReports = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const fetchedReports = await getRejectedReports();
        setReports(fetchedReports);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [getRejectedReports]);

  return (
    <Card className="h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col items-center justify-center mb-6">
          <FileX className="w-14 h-14 text-blue-900 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Reportes rechazados
          </h2>
          <div className="w-20 h-1 bg-blue-900 rounded-full mt-2" />
        </div>
        <div className="flex-1 overflow-auto">
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="p-3 border rounded">
                <div className="font-medium">Reporte #{r.id}</div>
                <div className="font-medium">{(r.username ?? r.name ?? '').trim()} {r.lastName ?? ''}</div>
                <div className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}


