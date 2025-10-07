import axios from "axios";
import { StatusResponseDto } from "@/types/status-response.dto";

const API_URL = process.env.BASE_URL || "http://localhost:4000/v1/statuses";

export const getStatusList = async (): Promise<StatusResponseDto[]> => {
  const response = await axios.get<StatusResponseDto[]>(`${API_URL}/v1/status/list`);
  return response.data;
};
