import { useState, useEffect, useCallback, useRef } from "react";
import { useAuth } from "../context/useAuth.js";
import CardIndicador from "../components/CardIndicador.jsx";
import AlertMessage from "../components/AlertMessage.jsx";
import AlertaErrorCarga from "../components/AlertaErrorCarga.jsx";
import BotonEnlace from "../components/BotonEnlace.jsx";
import Button from "../components/Button.jsx";
import { dashboardService } from "../services/dashboardService.js";
import { ESTADOS_RESERVA, ROLES } from "../utils/constantes.js";

const RESUMEN_POR_ROL = {
  [ROLES.ADMINISTRADOR]: "Resumen general de reservas",
  [ROLES.SOLICITANTE]: "Resumen de tus reservas",
  [ROLES.RESPONSABLE_AMBIENTE]:
    "Resumen de las reservas de tus ambientes",
};

const MENSAJE_VACIO_POR_ROL = {
  [ROLES.ADMINISTRADOR]:
    "Aún no hay reservas registradas en el sistema. Puedes registrar la primera.",
  [ROLES.SOLICITANTE]:
    "Aún no has realizado ninguna reserva. Crea tu primera solicitud.",
  [ROLES.RESPONSABLE_AMBIENTE]:
    "Los ambientes a tu cargo aún no tienen reservas registradas.",
};

const GRID_CLASES =
  "grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5";

const formatearHora = (fecha) =>
  new Intl.DateTimeFormat("es-PE", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).format(fecha);

export default function DashboardPage() {
  const { usuario } = useAuth();
  const h1Ref = useRef(null);

  const [dashboard, setDashboard] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [ultimaActualizacion, setUltimaActualizacion] = useState(null);
  const [anuncio, setAnuncio] = useState("");
  const [versionPeticion, setVersionPeticion] = useState(0);

  useEffect(() => {
    document.title = "Inicio | ReservaUPLA";
  }, []);

  useEffect(() => {
    h1Ref.current?.focus();
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    dashboardService
      .obtener({ signal: controller.signal })
      .then((datos) => {
        if (controller.signal.aborted) return;

        const ahora = new Date();
        setDashboard(datos ?? {});
        setUltimaActualizacion(ahora);
        setError("");
        setCargando(false);
        setAnuncio(`Indicadores actualizados a las ${formatearHora(ahora)}.`);
      })
      .catch((err) => {
        if (controller.signal.aborted) return;

        setError(
          err.message || "No se pudieron cargar los indicadores del dashboard."
        );
        setCargando(false);
        setAnuncio("No se pudieron actualizar los indicadores.");
      });

    return () => {
      controller.abort();
    };
  }, [versionPeticion]);

  const actualizar = useCallback(() => {
    setCargando(true);
    setError("");
    setAnuncio("Actualizando indicadores.");
    setVersionPeticion((v) => v + 1);
  }, []);

  const total = dashboard?.totalReservas ?? 0;
  const pendientes = dashboard?.pendientes ?? 0;
  const aprobadas = dashboard?.aprobadas ?? 0;
  const rechazadas = dashboard?.rechazadas ?? 0;
  const ambiente = dashboard?.ambienteMasUtilizado ?? null;
  const ambienteId = ambiente?.ambienteId;

  const todoEnCero =
    total === 0 && pendientes === 0 && aprobadas === 0 && rechazadas === 0;

  const puedeReservar =
    usuario?.rol === ROLES.SOLICITANTE ||
    usuario?.rol === ROLES.ADMINISTRADOR;

  const descripcionTotal =
    usuario?.rol === ROLES.SOLICITANTE
      ? "Tus solicitudes registradas"
      : usuario?.rol === ROLES.RESPONSABLE_AMBIENTE
        ? "Reservas en tus ambientes"
        : "Reservas registradas en el sistema";

  const mensajeVacio =
    MENSAJE_VACIO_POR_ROL[usuario?.rol] ||
    "Aún no hay reservas registradas.";

  return (
    <div className="space-y-6">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <h1
            ref={h1Ref}
            tabIndex={-1}
            className="text-2xl font-bold text-slate-900 focus:outline-none"
          >
            Hola, {usuario?.nombreCompleto || "usuario"}
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            {RESUMEN_POR_ROL[usuario?.rol] || "Resumen de reservas"}
          </p>
        </div>

        <div className="flex flex-col items-start gap-1 sm:items-end">
          <Button
            variant="secondary"
            onClick={actualizar}
            loading={cargando && Boolean(dashboard)}
            disabled={cargando}
            className="text-sm"
          >
            Actualizar
          </Button>
          <p className="text-xs text-slate-500">
            {ultimaActualizacion
              ? `Última actualización: ${formatearHora(ultimaActualizacion)}`
              : "Sin actualizar todavía"}
          </p>
        </div>
      </header>

      <div role="status" aria-live="polite" className="sr-only">
        {anuncio}
      </div>

      {error && (
        <AlertaErrorCarga
          title="No se pudieron cargar los indicadores"
          message={error}
          onRetry={actualizar}
          onClose={() => setError("")}
        />
      )}

      {cargando && !dashboard && (
        <div className={GRID_CLASES} aria-busy="true">
          {Array.from({ length: 5 }).map((_, indice) => (
            <div
              key={indice}
              aria-hidden="true"
              className="rounded-r-lg border-y border-r border-l-4 border-l-slate-200 border-slate-200 bg-white p-5 shadow-sm"
            >
              <div className="h-4 w-28 rounded bg-slate-200 motion-safe:animate-pulse" />
              <div className="mt-3 h-8 w-16 rounded bg-slate-200 motion-safe:animate-pulse" />
              <div className="mt-2 h-3 w-32 rounded bg-slate-100 motion-safe:animate-pulse" />
            </div>
          ))}
        </div>
      )}

      {dashboard && (
        <section aria-labelledby="titulo-indicadores" className="space-y-4">
          <h2 id="titulo-indicadores" className="sr-only">
            Indicadores de reservas
          </h2>

          {todoEnCero && !error && (
            <AlertMessage
              type="info"
              title="Todavía no hay reservas"
              message={
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <span>{mensajeVacio}</span>
                  {puedeReservar && (
                    <BotonEnlace to="/reservas/nueva" className="w-fit">
                      Nueva reserva
                    </BotonEnlace>
                  )}
                </div>
              }
            />
          )}

          {!(todoEnCero && !error) && (
            <div
              className={GRID_CLASES}
              aria-busy={cargando ? "true" : undefined}
            >
              <CardIndicador
                titulo="Total de reservas"
                valor={total}
                descripcion={descripcionTotal}
                tono="neutral"
                to="/reservas"
              />

              <CardIndicador
                titulo="Reservas pendientes"
                valor={pendientes}
                descripcion="En espera de revisión"
                tono="warning"
                to={`/reservas?estado=${ESTADOS_RESERVA.PENDIENTE}`}
              />

              <CardIndicador
                titulo="Reservas aprobadas"
                valor={aprobadas}
                descripcion="Confirmadas"
                tono="success"
                to={`/reservas?estado=${ESTADOS_RESERVA.APROBADA}`}
              />

              <CardIndicador
                titulo="Reservas rechazadas"
                valor={rechazadas}
                descripcion="Solicitudes denegadas"
                tono="danger"
                to={`/reservas?estado=${ESTADOS_RESERVA.RECHAZADA}`}
              />

              <CardIndicador
                titulo="Ambiente más utilizado"
                valor={ambiente?.nombre ?? "Sin datos todavía"}
                descripcion={
                  ambiente
                    ? `${ambiente.totalReservas} ${
                        ambiente.totalReservas === 1
                          ? "reserva aprobada"
                          : "reservas aprobadas"
                      }`
                    : undefined
                }
                tono="neutral"
                to={
                  ambienteId
                    ? `/reservas?ambienteId=${ambienteId}`
                    : undefined
                }
              />
            </div>
          )}
        </section>
      )}
    </div>
  );
}
