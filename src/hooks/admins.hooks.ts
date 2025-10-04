import { getAdmins } from "@/services/admin.service";
import { AdminDto } from "@/types/admin.dto";
import { useState } from "react";

interface UseAdminListReturn {
  isLoading: boolean;
  error: string | null;
  admins: AdminDto[] | null;
  fetchAdmins: () => Promise<void>;
}

export function useAdminList(): UseAdminListReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [admins, setAdmins] = useState<AdminDto[] | null>(null);

  const fetchAdmins = async (): Promise<void> => {
    setIsLoading(true);
    setError(null);

    try {
        const response = await getAdmins();
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

  return {
    isLoading,
    error,
    admins,
    fetchAdmins,
  };
}
