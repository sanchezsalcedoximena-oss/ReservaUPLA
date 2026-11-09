import apiClient from "./apiClient.js";

export const ambienteService = {
  crear(datos) {
    return apiClient.post("/ambiente", datos);
  },
  listar(soloDisponibles = false) {
    const endpoint = soloDisponibles ? "/ambiente?soloDisponibles=true" : "/ambiente";
    return apiClient.get(endpoint);
  },
};
