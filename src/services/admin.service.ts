import { AdminDto } from "@/types/admin.dto";
import axios from "axios";

export async function getAdmins(): Promise<AdminDto[]> {
    const response = await axios.get<AdminDto[]>(
      "http://localhost:4000/v1/admins/list", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
        },
      }
    );
    return response.data;
}