import axios from "axios";
import { ReportDto } from "@/types/report.dto";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000/v1";

export async function getPendingReports(token: string): Promise<ReportDto[]> {
  const response = await axios.get<ReportDto[]>(`${BASE_URL}/reports/pending`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
}
