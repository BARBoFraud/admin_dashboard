import { Button } from "@/components/ui/button";
import { ReportDto } from "@/types/report.dto";

function formatDate(dateStr?: string | null) {
  if (!dateStr) return "-";
  try {
    const d = new Date(dateStr);
    return d.toLocaleString("es-ES", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return dateStr;
  }
}

export default function ReportDetailCard({
  report,
  onClose,
}: {
  report: ReportDto;
  onClose: () => void;
}) {
  const dateFormatted = formatDate(report.createdAt);

  const category = report.category;
  let primaryLabel = "Principal";
  let primaryValue: string = "-";

  if (category === "Correo electrónico") {
    primaryLabel = "Correo electrónico";
    primaryValue = report.email ?? "-";
  } else if (category === "Página de internet") {
    primaryLabel = "Página de internet";
    primaryValue = report.url ?? "-";
  } else if (category === "Red social") {
    primaryLabel = "Red social";
    primaryValue = report.socialMedia ?? "-";
  } else if (category === "Mensaje") {
    primaryLabel = "Mensaje";
    primaryValue = report.website ?? "-";
  } else if (category === "Llamada") {
    primaryLabel = "Llamada";
    primaryValue = report.phoneNumber ?? "-";
  }

  return (
    <div className="bg-card border rounded-2xl shadow-lg overflow-hidden max-w-3xl mx-auto">
      <div className="p-5 flex gap-6">
        {report.image ? (
          <div className="w-40 flex-shrink-0">
            <img
              src={report.image}
              className="w-full h-40 object-cover rounded-lg border"
            />
          </div>
        ) : null}

        <div className="flex-1">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Reporte</div>
              <div className="text-2xl font-semibold">#{report.id}</div>
            </div>

            <div className="text-right">
              <div className="text-sm text-muted-foreground">Fecha</div>
              <div className="font-medium">{dateFormatted}</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-muted-foreground">Descripción</div>
              <div className="mt-1 text-sm">{report.description ?? "-"}</div>

              <div className="text-sm text-muted-foreground mt-3">Usuario</div>
              <div className="mt-1 font-medium">
                {report.name || report.lastName
                  ? `${report.name} ${report.lastName}`
                  : "-"}
              </div>
              <div className="text-sm text-muted-foreground mt-3">
                Categoría
              </div>
              <div className="mt-1 capitalize">{report.category ?? "-"}</div>
            </div>

            <div>
              <div className="text-sm text-muted-foreground">
                {primaryLabel}
              </div>
              <div className="mt-1 capitalize">{primaryValue}</div>

              {!report.image && (
                <div className="mt-6 p-3 rounded-lg bg-muted text-sm text-muted-foreground">
                  Evidencia no disponible
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 mt-6">
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
