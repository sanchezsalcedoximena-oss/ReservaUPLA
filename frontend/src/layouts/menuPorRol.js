import { ROLES } from "../utils/constantes.js";

export const menuPorRol = {
  [ROLES.ADMINISTRADOR]: [
    { to: "/", label: "Inicio" },
    { to: "/reservas", label: "Reservas" },
    { to: "/reservas/nueva", label: "Nueva reserva" },
    { to: "/usuarios/nuevo", label: "Registrar usuario" },
    { to: "/ambientes/nuevo", label: "Registrar ambiente" },
  ],
  [ROLES.SOLICITANTE]: [
    { to: "/", label: "Inicio" },
    { to: "/reservas", label: "Reservas" },
    { to: "/reservas/nueva", label: "Nueva reserva" },
  ],
  [ROLES.RESPONSABLE_AMBIENTE]: [
    { to: "/", label: "Inicio" },
    { to: "/reservas", label: "Reservas" },
  ],
};

export function obtenerMenuUsuario(rol) {
  return menuPorRol[rol] || [{ to: "/", label: "Inicio" }];
}
