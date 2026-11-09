import { NavLink, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import LogoUPLA from "../components/LogoUPLA.jsx";
import Button from "../components/Button.jsx";
import ErrorBoundary from "../components/ErrorBoundary.jsx";
import { obtenerMenuUsuario } from "./menuPorRol.js";
import { ETIQUETAS_ROL } from "../utils/constantes.js";

export default function AppLayout() {
  const { usuario, cerrarSesion } = useAuth();
  const { pathname } = useLocation();
  const menuItems = obtenerMenuUsuario(usuario?.rol);

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <a
        href="#contenido"
        className="sr-only rounded shadow-md focus:not-sr-only focus:absolute focus:left-2 focus:top-2 focus:z-50 focus:bg-white focus:px-4 focus:py-2 focus:font-medium focus:text-upla-700 focus:outline focus:outline-2 focus:outline-upla-500"
      >
        Saltar al contenido
      </a>

      <header className="sticky top-0 z-40 border-b border-slate-200 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <LogoUPLA width="150px" animado={false} variante="color" />

              <nav
                aria-label="Principal"
                className="hidden items-center gap-1 md:flex"
              >
                {menuItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) =>
                      `rounded-md px-3 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-upla-500 ${
                        isActive
                          ? "bg-upla-50 font-semibold text-upla-700"
                          : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
              </nav>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden text-right sm:block">
                <p className="text-sm font-medium text-slate-900">
                  {usuario?.nombreCompleto}
                </p>
                <p className="text-xs text-slate-500">
                  {ETIQUETAS_ROL[usuario?.rol] || usuario?.rol}
                </p>
              </div>

              <Button
                variant="secondary"
                onClick={cerrarSesion}
                className="min-h-[40px] px-3 py-1.5 text-xs sm:text-sm"
              >
                Cerrar sesión
              </Button>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 overflow-x-auto border-t border-slate-200 px-4 py-2 md:hidden">
          <nav aria-label="Principal móvil" className="flex items-center gap-1">
            {menuItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  `whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-upla-500 ${
                    isActive
                      ? "bg-upla-50 font-semibold text-upla-700"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main
        id="contenido"
        tabIndex={-1}
        className="mx-auto w-full max-w-7xl flex-1 p-4 focus:outline-none sm:p-6 lg:p-8"
      >
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>
    </div>
  );
}
