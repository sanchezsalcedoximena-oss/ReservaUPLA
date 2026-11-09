import apiClient from "./apiClient.js";

export const reservaService = {  crear(datos, options = {}) {
    return apiClient.post("/reserva", datos, options);
  },
  listar(filtro = {}, options = {}) {
    const params = new URLSearchParams();
    if (filtro.estado) params.append("estado", filtro.estado);
    if (filtro.ambienteId) params.append("ambienteId", filtro.ambienteId);
    if (filtro.fecha) params.append("fecha", filtro.fecha);
    const qs = params.toString();
    return apiClient.get(qs ? `/reserva?${qs}` : "/reserva", options);
  },
  obtener(id, options = {}) {
    return apiClient.get(`/reserva/${id}`, options);
  },
  cambiarEstado(id, estado, options = {}) {
    return apiClient.patch(`/reserva/${id}/estado`, { estado }, options);
  },
};
