import apiClient from "./apiClient.js";

export const usuarioService = {
  crear(datos) {
    return apiClient.post("/usuario", datos);
  },
  listar(rol) {
    const endpoint = rol ? `/usuario?rol=${encodeURIComponent(rol)}` : "/usuario";
    return apiClient.get(endpoint);
  },
};
