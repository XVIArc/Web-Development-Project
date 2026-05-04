const BASE = import.meta.env.VITE_API_URL || "/api";

const handle = async (res) => {
  const data = await res.json();
  if (!data.success) throw new Error(data.error || "Something went wrong");
  return data.data;
};

export const authApi = {
  login: ({ username, password }) =>
    fetch(`${BASE}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),

  register: ({ username, password }) =>
    fetch(`${BASE}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    }).then(handle),
};
