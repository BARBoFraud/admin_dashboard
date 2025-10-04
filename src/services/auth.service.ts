import axios from "axios";
import {
  AdminLoginDto,
  AdminLoginResponse,
  RefreshTokenResponse,
} from "../types/auth.dto";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000/v1";

export async function adminLogin(
  data: AdminLoginDto,
): Promise<AdminLoginResponse> {
  const response = await axios.post<AdminLoginResponse>(
    `${BASE_URL}/auth/admins/login`,
    data,
  );
  return response.data;
}

export async function adminLogout(token: string): Promise<void> {
  await axios.post(`${BASE_URL}/auth/admins/logout`, {
    refreshToken: token,
  });
}

export async function refreshToken(
  token: string,
): Promise<RefreshTokenResponse> {
  const response = await axios.post<RefreshTokenResponse>(
    `${BASE_URL}/auth/admins/refresh`,
    {
      refreshToken: token,
    },
  );
  return response.data;
}

