import { getAdminsService, deleteAdminService } from "@/services/admin.service";
import { AdminDto } from "@/types/admin.dto";
import { useState } from "react";
import { useAdminLogin } from "./auth.hooks";

interface UseAdminListReturn {
  isLoading: boolean;
  error: string | null;
  admins: AdminDto[] | null;
  fetchAdmins: () => Promise<void>;
  deleteAdmin: (adminId: number) => Promise<void>;
}

export function useAdminList(): UseAdminListReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<AdminDto[] | null>(null);
  const { executeRefresh } = useAdminLogin();

  const fetchAdmins = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const refreshSuccess = await executeRefresh();
      if (!refreshSuccess) {
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token available");
      }

      const response = await getAdminsService(accessToken);
      setAdmins(response);
    } catch (err: any) {
      let errorMessage = "Failed to fetch admins. Please try again.";

      if (err.response?.status) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Unauthorized access. Please log in.";
            break;
          default:
            errorMessage = `Failed to fetch admins (${err.response.status}). Please try again.`;
        }
      }

      setError(errorMessage);
      setAdmins(null);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAdmin = async (adminId: number): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
      const refreshSuccess = await executeRefresh();
      if (!refreshSuccess) {
        return;
      }

      const accessToken = localStorage.getItem("accessToken");
      if (!accessToken) {
        throw new Error("No access token available");
      }

      await deleteAdminService(accessToken, adminId);
      await fetchAdmins();
    } catch (err: any) {
      let errorMessage = "Failed to delete admin. Please try again.";

      if (err.response?.status) {
        switch (err.response.status) {
          case 401:
            errorMessage = "Unauthorized access. Please log in.";
            break;
          case 404:
            errorMessage =
              "Admin not found. It may have already been deleted.";
            break;
          default:
            errorMessage = `Failed to delete admin (${err.response.status}). Please try again.`;
        }
      }

      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    admins,
    fetchAdmins,
    deleteAdmin,
  };
}
