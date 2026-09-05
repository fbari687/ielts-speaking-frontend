import apiClient from "./api";

export const speakingService = {
  async getQuestions() {
    const response = await apiClient.get("/speaking/questions");
    return response.data.data;
  },

  async getAttempts() {
    const response = await apiClient.get("/speaking/attempts");
    return response.data.data;
  },

  async submitAttempt(payload) {
    const response = await apiClient.post("/speaking/submit", payload);
    return response.data.data;
  },
};
