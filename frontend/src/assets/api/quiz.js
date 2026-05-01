export const authApi = {
  login: async ({ username, password }) => {
    if (username === "admin" && password === "admin")
      return { token: "mock-token", role: "admin" };
    if (username === "user" && password === "user")
      return { token: "mock-token", role: "player" };
    throw new Error("Invalid credentials");
  },
  register: async ({ username }) => {
    return { token: "mock-token", role: "player" };
  },
};
//MOCK
