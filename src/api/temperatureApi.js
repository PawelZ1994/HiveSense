import { apiRequest } from "./client";
import { getToken } from "../storage/authStorage";

export async function getDeviceTemperatures(deviceId, date) {
  const token = await getToken();

  return apiRequest(
    `/app/devices/${deviceId}/temperatures?date=${date}`,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
}