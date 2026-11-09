import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import Spinner from "../components/Spinner.jsx";
import NoAutorizadoPage from "../pages/NoAutorizadoPage.jsx";
import { ETIQUETAS_ROL } from "../utils/constantes.js";

export default function RutaProtegida({ roles, children }) {
  const { usuario, cargando } = useAuth();
  const location = useLocation();

  if (cargando) {
    return (
      <div
        className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-50"
        role="status"
        aria-label="Cargando sesión"
      >
        <Spinner size="lg" className="h-10 w-10 text-upla-500" />
        <span className="text-sm font-medium text-slate-600">
          Cargando sesión...
        </span>
      </div>
    );
  }

  if (!usuario) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(usuario.rol)) {
    return <NoAutorizadoPage rol={ETIQUETAS_ROL[usuario.rol] || usuario.rol} />;
  }

  return children ? children : <Outlet />;
}
