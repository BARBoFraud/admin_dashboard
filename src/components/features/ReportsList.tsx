import { ShortPendingReport } from "@/types/reports.types";
import { useEffect, useState } from "react";
import { useReportsApi } from "@/api/Reports.api";

export default function ReportsList() {
  const [reports, setReports] = useState<ShortPendingReport[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { getPendingReports } = useReportsApi();

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
    <div>
      <h2 className="text-2xl font-bold mb-4">Pending Reports</h2>
      <ul className="space-y-4">
        {reports.map((report) => (
          <li key={report.id} className="p-4 border rounded-lg shadow-sm">
            <h3 className="text-xl font-semibold">
              {report.name && report.lastName
                ? `${report.name} ${report.lastName}`
                : "- -"}
            </h3>
            <p className="text-sm text-gray-500">
              Creado el: {new Date(report.createdAt).toLocaleDateString()}
            </p>
            <p className="mt-2">
              <strong>Categoria:</strong> {report.category}
            </p>
            {report.email && (
              <p>
                <strong>Email:</strong> {report.email}
              </p>
            )}
            {report.phoneNumber && (
              <p>
                <strong>Teléfono:</strong> {report.phoneNumber}
              </p>
            )}
            {report.website && (
              <p>
                <strong>Sitio Web:</strong>{" "}
                <a
                  href={report.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {report.website}
                </a>
              </p>
            )}
            {report.socialMedia && (
              <p>
                <strong>Red Social:</strong>{" "}
                <a
                  href={report.socialMedia}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  {report.socialMedia}
                </a>
              </p>
            )}
            {report.username && (
              <p>
                <strong>Nombre de Usuario:</strong> {report.username}
              </p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
