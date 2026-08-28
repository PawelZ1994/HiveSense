import { apiRequest } from "./client";
import { getToken } from "../storage/authStorage";

export async function getDevices() {
  const token = await getToken();

  return apiRequest("/app/devices", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}