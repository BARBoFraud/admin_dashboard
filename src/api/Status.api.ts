import axios from "axios";
import { useCallback } from "react";
import type { Status } from "@/types/status.types";

const BASE_URL = process.env.BASE_URL || "http://localhost:4000";

export function useStatusApi() {
  const getStatuses = useCallback(async (): Promise<Status[]> => {
    try {
      const res = await axios.get<Status[]>(`${BASE_URL}/v1/status/list`);
      return res.data;
    } catch (err) {
      throw err;
    }
  }, []);

  return { getStatuses };
}
