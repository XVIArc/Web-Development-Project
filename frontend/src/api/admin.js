const BASE = import.meta.env.VITE_API_URL || "/api";

const getToken = () => localStorage.getItem("token");

const authHeaders = () => ({
  "Content-Type": "application/json",
  Authorization: `Bearer ${getToken()}`,
});

const handle = async (res) => {
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Something went wrong");
  return data.data;
};

export const adminApi = {
  getQuestions: () =>
    fetch(`${BASE}/admin/questions`, {
      headers: authHeaders(),
    }).then(handle),

  createQuestion: (data) =>
    fetch(`${BASE}/admin/questions`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handle),

  updateQuestion: (id, data) =>
    fetch(`${BASE}/admin/questions/${id}`, {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(data),
    }).then(handle),

  deleteQuestion: (id) =>
    fetch(`${BASE}/admin/questions/${id}`, {
      method: "DELETE",
      headers: authHeaders(),
    }).then(handle),

  toggleQuestion: (id) =>
    fetch(`${BASE}/admin/questions/${id}/toggle`, {
      method: "PATCH",
      headers: authHeaders(),
    }).then(handle),

  bulkImport: ({ questions }) =>
    fetch(`${BASE}/admin/questions/bulk`, {
      method: "POST",
      headers: authHeaders(),
      body: JSON.stringify({ questions }),
    }).then(handle),
};
