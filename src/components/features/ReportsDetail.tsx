"use client";

import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "../ui/card";
import { Button } from "../ui/button";
import type { DetailedReport } from "@/types/reportDetail.types";
import { useEffect, useState } from "react";
import { useStatusApi } from "@/api/Status.api";
import { useReportsDetailApi } from "@/api/ReportsDetail.api";
import type { Status } from "@/types/status.types";

type Props = {
  report: DetailedReport | null;
  isLoading?: boolean;
  isSubmitting?: boolean;
  errorMsg?: string | null;
  onClose: () => void;
  onCompleted?: (id: number) => void;
  source?: "list" | "accepted" | "rejected";
};

export default function ReportsDetail({
  report,
  isLoading,
  errorMsg,
  isSubmitting,
  onClose,
  onCompleted,
  source = "list",
}: Props) {
  if (!report) return null;

  const { getStatuses } = useStatusApi();
  const { evaluateReport } = useReportsDetailApi();
  const [statusMap, setStatusMap] = useState<Record<string, number>>({});

  useEffect(() => {
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
    })();
    return () => {
      mounted = false;
    };
  }, [getStatuses]);

  const fields: { label: string; value?: string | null }[] = [
    { label: "Nombre", value: report.name },
    { label: "Apellido", value: report.lastName },
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
        <Card className="shadow-xl rounded-xl overflow-hidden bg-background dark:bg-background-dark">
          <CardHeader className="flex justify-between items-center p-4 border-b border-border dark:border-border-dark">
            <CardTitle className="text-xl font-semibold text-foreground dark:text-foreground-dark">
              Reporte #{report.id}
            </CardTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground dark:text-muted-foreground-dark dark:hover:text-foreground-dark rounded-full p-1 transition-colors"
            >
              ✕
            </button>
          </CardHeader>

          <CardContent className="space-y-6 p-6">
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

            {/* {report.image && report.image.trim() !== "" && (
              <div className="flex justify-center mb-6">
                <img
                  src={report.image}
                  className="max-h-60 object-contain rounded-lg shadow-md"
                />
              </div>
            )} */}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {fields
                .filter((field) => field.value && field.value.trim() !== "")
                .map((field, idx) => (
                  <div
                    key={idx}
                    className="bg-secondary/10 dark:bg-secondary-dark/20 p-4 rounded-lg shadow-sm flex flex-col"
                  >
                    <span className="text-sm text-muted-foreground dark:text-muted-foreground-dark">
                      {field.label}
                    </span>
                    <span className="font-medium break-words text-foreground dark:text-foreground-dark">
                      {field.value}
                    </span>
                  </div>
                ))}
            </div>
          </CardContent>

          <CardFooter className="flex justify-end gap-3 p-4 border-t border-border dark:border-border-dark">
            {/** determine which buttons to show based on source prop */}
            {(source === "list" || source === "accepted") && (
              <Button
                variant="destructive"
                onClick={async () => {
                  if (!report) return;
                  try {
                    const rejectedId = statusMap["Rechazado"];
                    if (!rejectedId)
                      throw new Error("Estatus de 'Rechazado' no encontrado");
                    await evaluateReport(report.id, rejectedId);
                    onCompleted && onCompleted(report.id);
                  } catch (err) {
                    console.error(err);
                  } finally {
                  }
                }}
              >
                Rechazar
              </Button>
            )}

            {(source === "list" || source === "rejected") && (
              <Button
                onClick={async () => {
                  if (!report) return;
                  try {
                    const acceptedId = statusMap["Aceptado"];
                    if (!acceptedId)
                      throw new Error("Estatus de 'Aceptado' no encontrado");
                    await evaluateReport(report.id, acceptedId);
                    onCompleted && onCompleted(report.id);
                  } catch (err) {
                    console.error(err);
                  } finally {
                  }
                }}
              >
                Aceptar
              </Button>
            )}
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
