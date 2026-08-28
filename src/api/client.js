import { API_URL } from "../config/config";
import { getToken } from "../storage/authStorage";

export async function apiRequest(endpoint, options = {}) {
  const token = await getToken();

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,

    headers: {
      "Content-Type": "application/json",

      ...(token
        ? {
            Authorization: `Bearer ${token}`,
          }
        : {}),

      ...(options.headers || {}),
    },
  });

  const text = await response.text();

  let data;

  try {
    data = JSON.parse(text);
  } catch {
    throw new Error(
      `Serwer zwrócił nieprawidłową odpowiedź. Status: ${response.status}`
    );
  }

  if (!response.ok) {
    throw new Error(
      data.error ||
      data.message ||
      "Wystąpił błąd"
    );
  }

  return data;
}