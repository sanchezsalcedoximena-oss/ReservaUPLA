import { Routes, Route } from "react-router-dom";
import LoginPage from "../pages/LoginPage.jsx";
import DashboardPage from "../pages/DashboardPage.jsx";
import UsuarioNuevoPage from "../pages/UsuarioNuevoPage.jsx";
import AmbienteNuevoPage from "../pages/AmbienteNuevoPage.jsx";
import ReservaNuevaPage from "../pages/ReservaNuevaPage.jsx";
import ReservasPage from "../pages/ReservasPage.jsx";
import ReservaDetallePage from "../pages/ReservaDetallePage.jsx";
import NoEncontradaPage from "../pages/NoEncontradaPage.jsx";
import AppLayout from "../layouts/AppLayout.jsx";
import RutaProtegida from "./RutaProtegida.jsx";
import { ROLES } from "../utils/constantes.js";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<RutaProtegida />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/reservas" element={<ReservasPage />} />
          <Route path="/reservas/:id" element={<ReservaDetallePage />} />
        </Route>
      </Route>

      <Route
        element={
          <RutaProtegida
            roles={[ROLES.SOLICITANTE, ROLES.ADMINISTRADOR]}
          />
        }
      >
        <Route element={<AppLayout />}>
          <Route path="/reservas/nueva" element={<ReservaNuevaPage />} />
        </Route>
      </Route>

      <Route element={<RutaProtegida roles={[ROLES.ADMINISTRADOR]} />}>
        <Route element={<AppLayout />}>
          <Route path="/usuarios/nuevo" element={<UsuarioNuevoPage />} />
          <Route path="/ambientes/nuevo" element={<AmbienteNuevoPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NoEncontradaPage />} />
    </Routes>
  );
}
