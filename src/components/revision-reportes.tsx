"use client";

import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { usePendingReports } from "@/hooks/reports.hooks";
import { ReportDto } from "@/types/report.dto";
import ReportItem from "./report-item";
import ReportDetailCard from "./report-detail-card";

export default function RevisionReportes() {
  const { reports, isLoading, error, fetchReports } = usePendingReports();
  const [selected, setSelected] = useState<ReportDto | null>(null);

  useEffect(() => {
    fetchReports();
  }, []);

  useEffect(() => {
    if (!selected) return;
    return () => {
    };
  }, [selected]);


  return (
    <Card className="p-4">
      <h2 className="text-xl font-semibold mb-4">Reportes pendientes</h2>

      {isLoading && <div>Cargando...</div>}
      {error && <div className="text-red-600">{error}</div>}

      {!isLoading && reports?.length === 0 && <div>No hay reportes pendientes.</div>}

      <div className="flex flex-col gap-4">
        {reports?.map((r) => (
          <ReportItem key={r.id} report={r} onView={setSelected} />
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setSelected(null)}
          />

          <div className="relative h-full w-full flex items-center justify-center p-6">
            <div className="max-w-5xl w-full h-[90vh] overflow-auto">
              <ReportDetailCard report={selected} onClose={() => setSelected(null)} />
            </div>
          </div>
        </div>
      )}
    </Card>
  );
}
