import { handleApiResponse } from "./handleResponse";

const BASE = import.meta.env.VITE_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

export const adminApi = {
  getQuestions: () =>
    fetch(`${BASE}/admin/questions`, {
      headers: authHeaders(),
    }).then(handleApiResponse),

  createQuestion: (data) =>
    fetch(`${BASE}/admin/questions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleApiResponse),

  updateQuestion: (id, data) =>
    fetch(`${BASE}/admin/questions/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handleApiResponse),

  deleteQuestion: (id) =>
    fetch(`${BASE}/admin/questions/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handleApiResponse),

  toggleQuestion: (id) =>
    fetch(`${BASE}/admin/questions/${id}/toggle`, {
      method: "PATCH",
      headers: authHeaders(),
    }).then(handleApiResponse),

  bulkImport: ({ questions }) =>
    fetch(`${BASE}/admin/questions/bulk`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ questions }),
    }).then(handleApiResponse),
};
