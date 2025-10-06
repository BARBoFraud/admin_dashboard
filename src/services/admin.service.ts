import { AdminDto } from "@/types/admin.dto";
import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000/v1";

export async function getAdminsService(token: string): Promise<AdminDto[]> {
  const response = await axios.get<AdminDto[]>(`${BASE_URL}/admins/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export async function deleteAdminService(token: string, adminId: number): Promise<void> {
  await axios.delete(`${BASE_URL}/admins/${adminId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}