import axios from "axios";
import { AdminLoginDto, AdminLoginResponse } from "../types/auth.dto";

export async function adminLogin(
  data: AdminLoginDto,
): Promise<AdminLoginResponse> {
  const response = await axios.post<AdminLoginResponse>(
    "http://localhost:4000/v1/auth/admins/login",
    data,
  );
  return response.data;
}

export async function adminLogout(token: string): Promise<void> {
  await axios.post("http://localhost:4000/v1/auth/admins/logout", {
    refreshToken: token,
  });
}

