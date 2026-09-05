import apiClient from "./api";

export const authService = {
  async register(data) {
    const response = await apiClient.post("/auth/register", data);
    return response.data.data;
  },

  async login(data) {
    const response = await apiClient.post("/auth/login", data);
    return response.data.data;
  },

  async logout() {
    const response = await apiClient.post("/auth/logout");
    return response.data;
  },

  async getProfile() {
    const response = await apiClient.get("/auth/me");
    return response.data.data;
  },
};
