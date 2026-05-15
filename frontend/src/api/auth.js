import { handleApiResponse } from "./handleResponse";

const BASE = import.meta.env.VITE_API_URL || "/api";

export const authApi = {
  login: ({ username, password }) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handleApiResponse),

  register: ({ username, password }) =>
    fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handleApiResponse),
};
