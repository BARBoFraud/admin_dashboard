import { useAuth } from "@/contexts/AuthContext";
import { AdminType } from "@/types/admin.types";
import axios from "axios";
import { useCallback } from "react";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export function useAdminsApi() {
    const {accessToken, refreshTokenFunc} = useAuth();

    const getAdminsList = useCallback(async () => {
        try {
            const response = await axios.get<AdminType[]>(`${BASE_URL}/v1/admins/list`, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log('Fetched admins:', response.data);
            return response.data;
        } catch (error) {
            if(axios.isAxiosError(error) && error.response?.status === 401) {
                await refreshTokenFunc();

                const newAccessToken = localStorage.getItem("accessToken");

                if(!newAccessToken) {
                    throw new Error("No se pudo refrescar el token");
                }

                const retryResponse = await axios.get(`${BASE_URL}/v1/admins/list`, {
                    headers: { Authorization: `Bearer ${newAccessToken}` }
                });
                return retryResponse.data;
            }
            throw error;
        }
    }, [accessToken, refreshTokenFunc]);

    const createAdmin = useCallback(async (username: string, password: string): Promise<void> => {
        try {
            await axios.post(`${BASE_URL}/v1/admins/create`, {
                username,
                password
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
        } catch (error) {
            if(axios.isAxiosError(error) && error.response?.status === 401) {
                await refreshTokenFunc();

                const newAccessToken = localStorage.getItem("accessToken");

                if(!newAccessToken) {
                    throw new Error("No se pudo refrescar el token");
                }

                await axios.post(`${BASE_URL}/v1/admins/create`, {
                    username,
                    password
                }, {
                    headers: { Authorization: `Bearer ${newAccessToken}` }
                });
            }
            throw error;
        }
    }, [accessToken, refreshTokenFunc]);

    return { getAdminsList, createAdmin };
}