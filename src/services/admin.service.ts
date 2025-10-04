import { AdminDto } from "@/types/admin.dto";
import axios from "axios";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000/v1";

export async function getAdmins(token: string): Promise<AdminDto[]> {
  const response = await axios.get<AdminDto[]>(`${BASE_URL}/admins/list`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

