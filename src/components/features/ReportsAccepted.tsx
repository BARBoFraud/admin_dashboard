"use client";

import { ShortPendingReport } from "@/types/reports.types";
import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { useReportsApi } from "@/api/Reports.api";
import { FileCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import ReportsDetail from "@/components/features/ReportsDetail";
import type { DetailedReport } from "@/types/reportDetail.types";
import { useReportsDetailApi } from "@/api/ReportsDetail.api";

export default function ReportsAccepted() {
  const [reports, setReports] = useState<ShortPendingReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<DetailedReport | null>(null);
  const { getAcceptedReports } = useReportsApi();
  const { getReportDetail } = useReportsDetailApi();

  useEffect(() => {
    const fetchReports = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const fetchedReports = await getAcceptedReports();
        setReports(fetchedReports);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [getAcceptedReports]);

  return (
    <Card className="h-full">
      <div className="p-6 h-full flex flex-col">
        <div className="flex flex-col items-center justify-center mb-6">
          <FileCheck className="w-14 h-14 text-blue-500 mb-2" />
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
            Reportes aceptados
          </h2>
          <div className="w-20 h-1 bg-blue-500 rounded-full mt-2" />
        </div>
        <div className="flex-1 overflow-auto">
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="p-3 border rounded flex items-center justify-between">
                <div>
                  <div className="font-medium">Reporte #{r.id}</div>
                  <div className="font-medium">{(r.username ?? r.name ?? '').trim()} {r.lastName ?? ''}</div>
                  <div className="text-sm text-muted-foreground">{new Date(r.createdAt).toLocaleString()}</div>
                </div>
                <div>
                  <Button
                    size="sm"
                    onClick={async () => {
                      setSelectedId(r.id);
                      setDetail(null);
                      try {
                        const data = await getReportDetail(r.id);
                        setDetail(data);
                      } catch (err) {
                        console.error(err);
                      }
                    }}
                  >
                    Ver
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        </div>

      {selectedId !== null && (
        <ReportsDetail
          report={detail}
          source="accepted"
          onClose={() => {
            setSelectedId(null);
            setDetail(null);
          }}
          onCompleted={(id: number) => {
            setReports((prev) => prev.filter((r) => r.id !== id));
            setSelectedId(null);
            setDetail(null);
          }}
        />
      )}
      </div>
    </Card>
  );
}


