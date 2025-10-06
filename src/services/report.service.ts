import axios from "axios";
import { ReportDto } from "@/types/report.dto";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000/v1";

export async function getPendingReports(token: string): Promise<ReportDto[]> {
  const response = await axios.get<ReportDto[]>(`${BASE_URL}/reports/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}

export async function changeReportStatus(token: string, reportId: number, statusId: number): Promise<void> {
  await axios.patch(
    `${BASE_URL}/reports/evaluate`,
    { reportId, statusId },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );
}


