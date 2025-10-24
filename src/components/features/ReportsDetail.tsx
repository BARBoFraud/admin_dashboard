"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import type { DetailedReport } from "@/types/reportDetail.types";
import { useStatusApi } from "@/api/Status.api";
import { useReportsDetailApi } from "@/api/ReportsDetail.api";
import type { Status } from "@/types/status.types";
import type { Risk } from "@/types/risks.types";
import { usePercentagesApi } from "@/api/Risks.api";

type Props = {
  report: DetailedReport | null;
  isLoading?: boolean;
  errorMsg?: string | null;
  onClose: () => void;
  onCompleted?: (id: number) => void;
  source?: "list" | "accepted" | "rejected" | "riesgo";
};

export default function ReportsDetail({
  report,
  isLoading,
  errorMsg,
  onClose,
  onCompleted,
  source = "list",
}: Props) {
  const { getStatuses } = useStatusApi();
  const { getRiskList } = usePercentagesApi();
  const { evaluateReport } = useReportsDetailApi();

  const [statusMap, setStatusMap] = useState<Record<string, number>>({});
  const [riskMap, setRiskMap] = useState<Record<string, number>>({});
  const [selectedRisk, setSelectedRisk] = useState<string | null>(
    report?.riskLevel ?? null
  );
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (!report) return;

    setSelectedRisk(report.riskLevel ?? null);

    let mounted = true;
    (async () => {
      try {
        const statuses: Status[] = await getStatuses();
        if (!mounted) return;
        const map: Record<string, number> = {};
        statuses.forEach((s) => (map[s.name] = s.id));
        setStatusMap(map);
      } catch (err) {
        console.error("Error fetching statuses", err);
      }

      try {
        const risks: Risk[] = await getRiskList();
        if (!mounted) return;
        const map: Record<string, number> = {};
        risks.forEach((r) => (map[r.level] = r.id));
        setRiskMap(map);
      } catch (err) {
        console.error("Error fetching risk list", err);
      }

      try {
        setImageUrl(null);

        const imgField: string | undefined =
          typeof report.image === "string" ? report.image : undefined;
        setImageUrl(imgField ?? null);
      } catch (err) {
        console.error("Error setting image URL", err);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [getStatuses, getRiskList, report]);

  if (!report) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
        <div className="bg-background dark:bg-background-dark p-6 rounded-lg shadow-md">
          <p className="text-muted-foreground dark:text-muted-foreground-dark">
            No hay reporte seleccionado.
          </p>
          <div className="flex justify-end mt-4">
            <Button onClick={onClose}>Cerrar</Button>
          </div>
        </div>
      </div>
    );
  }

  const fields: { label: string; value?: string | null }[] = [
    { label: "Nombre", value: report.name },
    { label: "Apellido", value: report.lastName },
    { label: "Riesgo", value: report.riskLevel },
    { label: "Categoría", value: report.category },
    { label: "Creado", value: new Date(report.createdAt).toLocaleString() },
    { label: "Descripción", value: report.description },
    { label: "Email", value: report.email },
    { label: "Usuario", value: report.username },
    { label: "Teléfono", value: report.phoneNumber },
    { label: "Sitio / URL", value: report.website ?? report.url },
    { label: "Red social", value: report.socialMedia },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-3xl pointer-events-auto">
        <Card className="shadow-xl rounded-xl overflow-hidden bg-background dark:bg-background-dark max-h-[80vh]">
          <CardHeader className="flex justify-between items-center p-4 border-b border-border dark:border-border-dark">
            <CardTitle className="text-xl font-semibold text-foreground dark:text-foreground-dark">
              {report.title}
            </CardTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground dark:text-muted-foreground-dark dark:hover:text-foreground-dark rounded-full p-1 transition-colors"
            >
              ✕
            </button>
          </CardHeader>

          <CardContent className="space-y-6 p-6 overflow-auto" style={{ maxHeight: 'calc(80vh - 128px)' }}>
            {isLoading && (
              <p className="text-muted-foreground dark:text-muted-foreground-dark">
                Cargando...
              </p>
            )}
            {errorMsg && (
              <p className="text-destructive dark:text-destructive-dark">
                {errorMsg}
              </p>
            )}

            {imageUrl && (
              <div className="flex justify-center mb-6">
                <Image
                  src={imageUrl}
                  alt={report.title}
                  width={400}
                  height={240}
                  className="object-contain rounded-lg shadow-md max-h-60"
                  unoptimized
                />
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm text-muted-foreground mb-2">
                  Nivel de riesgo
                </label>
                <select
                  value={selectedRisk ?? ""}
                  onChange={(e) => setSelectedRisk(e.target.value || null)}
                  className="w-full border rounded px-3 py-2 bg-background dark:bg-background-dark"
                >
                  <option value="">-- Selecciona nivel de riesgo --</option>
                  {Object.keys(riskMap).map((riskName) => (
                    <option key={riskName} value={riskName}>
                      {riskName}
                    </option>
                  ))}
                </select>
                {!selectedRisk && (
                  <p className="text-sm mt-2">
                    Debes seleccionar un nivel de riesgo antes de aceptar o
                    rechazar.
                  </p>
                )}
                {selectedRisk && !(selectedRisk in riskMap) && (
                  <p className="text-sm mt-2">
                    El nivel seleccionado no existe en la lista de riesgos del
                    sistema. Por favor, espera a que cargue la lista o
                    selecciona otro nivel.
                  </p>
                )}
              </div>

              {fields
                .filter((f) => f.value && f.value.trim() !== "")
                .map((f, i) => (
                  <div
                    key={i}
                    className="bg-secondary/10 dark:bg-secondary-dark/20 p-4 rounded-lg shadow-sm flex flex-col"
                  >
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                      {f.label}
                    </span>
                    <span className="font-medium break-words text-foreground dark:text-foreground-dark">
                      {f.value}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 p-4 border-t border-border dark:border-border-dark">
            {(source === "list" || source === "accepted") && (
              <Button
                variant="destructive"
                disabled={!selectedRisk || !(selectedRisk in riskMap)}
                onClick={async () => {
                  if (!selectedRisk) return;
                  try {
                    const rejectedId = statusMap["Rechazado"];
                    if (!rejectedId)
                      throw new Error("Estatus de 'Rechazado' no encontrado");
                    const riskId = riskMap[selectedRisk];
                    if (riskId == null)
                      throw new Error(
                        "El nivel de riesgo seleccionado no tiene un id asociado"
                      );
                    await evaluateReport(report.id, rejectedId, riskId);
                    onCompleted?.(report.id);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Rechazar
              </Button>
            )}

            {(source === "list" || source === "rejected") && (
              <Button
                disabled={!selectedRisk || !(selectedRisk in riskMap)}
                onClick={async () => {
                  if (!selectedRisk) return;
                  try {
                    const acceptedId = statusMap["Aceptado"];
                    if (!acceptedId)
                      throw new Error("Estatus de 'Aceptado' no encontrado");
                    const riskId = riskMap[selectedRisk];
                    if (riskId == null)
                      throw new Error(
                        "El nivel de riesgo seleccionado no tiene un id asociado"
                      );
                    await evaluateReport(report.id, acceptedId, riskId);
                    onCompleted?.(report.id);
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Aceptar
              </Button>
            )}

            {(source === "accepted" || source === "rejected") && (
              <Button
                variant="secondary"
                className="bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                disabled={!selectedRisk || !(selectedRisk in riskMap)}
                onClick={async () => {
                  if (!selectedRisk) return;
                  try {
                    const statusName =
                      source === "accepted" ? "Aceptado" : "Rechazado";
                    const statusId = statusMap[statusName];
                    if (!statusId)
                      throw new Error(
                        `Estatus de '${statusName}' no encontrado`
                      );
                    const riskId = riskMap[selectedRisk];
                    if (riskId == null)
                      throw new Error(
                        "El nivel de riesgo seleccionado no tiene un id asociado"
                      );
                    await evaluateReport(report.id, statusId, riskId);
                    onClose();
                  } catch (err) {
                    console.error(err);
                  }
                }}
              >
                Cambiar riesgo
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
