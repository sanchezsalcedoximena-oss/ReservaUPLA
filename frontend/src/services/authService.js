import { get, post } from "./apiClient.js";

export function login(correo, contrasena) {
  return post("/auth/login", { correo, contrasena });
}

export function logout() {
  return post("/auth/logout");
}

export function obtenerSesion() {
  return get("/auth/me");
}

export const authService = {
  login,
  logout,
  obtenerSesion,
};

export default authService;
