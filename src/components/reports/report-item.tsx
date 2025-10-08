import { Button } from "@/components/ui/button";
import { ReportDto } from "@/types/report.dto";

export default function ReportItem({ report, onView }: {
    report: ReportDto;
    onView: (r: ReportDto) => void;
}) {
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
        <div className="border rounded-md p-4 flex flex-col gap-3">
            <h3 className="text-lg font-semibold">Reporte #{report.id}</h3>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-sm text-muted-foreground">{primaryLabel}</div>
                    <div className="font-medium">{primaryValue}</div>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <div className="text-sm text-muted-foreground">{primaryLabel}</div>
                    <div className="font-medium">{report.description}</div>
                </div>
            </div>

            <div className="flex items-center justify-between p-4 border-b border-sidebar-border">
                <div>
                    <Button className="bg-background text-primary-foreground hover:bg-accent" onClick={() => onView(report)}>
                        Ver reporte
                    </Button>
                </div>
                <div className="flex justify-end gap-5">
                    <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                        Aceptar
                    </Button>
                    <Button variant="destructive">
                        Rechazar
                    </Button>
                </div>
            </div>
        </div>
    );
}

