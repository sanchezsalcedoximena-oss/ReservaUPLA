import apiClient from "./apiClient.js";

export const dashboardService = {
  obtener(options = {}) {
    return apiClient.get("/dashboard", options);
  },
};
