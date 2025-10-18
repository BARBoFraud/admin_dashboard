"use client";

import { ShortPendingReport } from "@/types/reports.types";
import { useEffect, useState } from "react";
import { useReportsApi } from "@/api/Reports.api";
import { Card } from "../ui/card";
import { Button } from "../ui/button";
import ReportsDetail from "./ReportsDetail";
import { useReportsDetailApi } from "@/api/ReportsDetail.api";
import type { DetailedReport } from "@/types/reportDetail.types";

export default function ReportsList() {
  const [reports, setReports] = useState<ShortPendingReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [detail, setDetail] = useState<DetailedReport | null>(null);
  const [detailSubmitting, setDetailSubmitting] = useState(false);
  const { getPendingReports } = useReportsApi();
  const { getReportDetail } = useReportsDetailApi();

  useEffect(() => {
    const fetchReports = async () => {
      if (isLoading) return;
      setIsLoading(true);
      try {
        const fetchedReports = await getPendingReports();
        setReports(fetchedReports);
      } finally {
        setIsLoading(false);
      }
    };
    fetchReports();
  }, [getPendingReports]);

  return (
    <>
      <Card className="h-full">
        <div className="p-8 h-full flex flex-col">
          <h2 className="text-4xl font-bold mb-4">Reportes Pendientes</h2>

          <div className="flex-1 overflow-auto">
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reports.map((report) => (
                <li
                  key={report.id}
                  className="p-4 border rounded-lg shadow-sm grid grid-cols-1 md:grid-cols-3 gap-4 items-start"
                >
                  <div className="md:col-span-2 space-y-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="text-xl font-semibold">
                        {report.name && report.lastName
                          ? `${report.name} ${report.lastName}`
                          : "- -"}
                      </h3>
                      <p className="text-sm text-gray-500">
                        Creado el:{" "}
                        {new Date(report.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <p>
                      <strong>Título:</strong> {report.title}
                    </p>
                    <p>
                      <strong>Categoría:</strong> {report.category}
                    </p>
                  </div>

                  <div className="md:flex md:flex-col md:justify-start md:mt-6">
                    <Button
                      className="bg-primary ml-auto"
                      onClick={async () => {
                        setSelectedId(report.id);
                        setDetail(null);
                        try {
                          const data = await getReportDetail(report.id);
                          setDetail(data);
                        } catch (e) {
                          console.error(
                            (e as Error).message || "Error cargando detalle"
                          );
                        } finally {
                        }
                      }}
                    >
                      Ver reporte
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Card>

      {selectedId !== null ? (
        <ReportsDetail
          report={detail}
          isSubmitting={detailSubmitting}
          onClose={() => {
            setSelectedId(null);
            setDetail(null);
          }}
          onCompleted={(id: number) => {
            setReports((prev) => prev.filter((r) => r.id !== id));
            setSelectedId(null);
          }}
        />
      ) : null}
    </>
  );
}
