import { getStatusList } from "@/services/status.service";
import { StatusResponseDto } from "@/types/status-response.dto";
import { useState } from "react";

export function useStatusList() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [statuses, setStatuses] = useState<StatusResponseDto[] | null>(null);

  const fetchStatuses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await getStatusList();
      setStatuses(response);
    } catch (err: any) {
      setError("Error al obtener la lista de estados.");
      setStatuses(null);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    statuses,
    fetchStatuses,
  };
}
