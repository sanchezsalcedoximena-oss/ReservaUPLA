import { useState, useEffect, useMemo, useCallback } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import TableList from "../components/TableList.jsx";
import SelectInput from "../components/SelectInput.jsx";
import DateInput from "../components/DateInput.jsx";
import Button from "../components/Button.jsx";
import AlertaErrorCarga from "../components/AlertaErrorCarga.jsx";
import BotonEnlace from "../components/BotonEnlace.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import EstadoBadge from "../components/EstadoBadge.jsx";
import { reservaService } from "../services/reservaService.js";
import { ambienteService } from "../services/ambienteService.js";
import { OPCIONES_ESTADO, ROLES } from "../utils/constantes.js";

export default function ReservasPage() {
  const { usuario } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();

  const estado = searchParams.get("estado") || "";
  const ambienteId = searchParams.get("ambienteId") || "";
  const fecha = searchParams.get("fecha") || "";

  const [reservas, setReservas] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState("");
  const [ambientes, setAmbientes] = useState([]);
  const [versionPeticion, setVersionPeticion] = useState(0);

  useEffect(() => {
    document.title = "Reservas | ReservaUPLA";
  }, []);

  // Carga del catálogo de ambientes para el filtro
  useEffect(() => {
    ambienteService
      .listar()
      .then((datos) => setAmbientes(datos || []))
      .catch(() => setAmbientes([]));
  }, []);

  // Carga de reservas con AbortController para evitar respuestas desordenadas
  useEffect(() => {
    const controller = new AbortController();

    reservaService
      .listar(
        {
          estado: estado || undefined,
          ambienteId: ambienteId || undefined,
          fecha: fecha || undefined,
        },
        { signal: controller.signal }
      )
      .then((datos) => {
        if (!controller.signal.aborted) {
          setReservas(datos || []);
          setError("");
          setCargando(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setError(err.message || "Error al cargar las reservas.");
          setCargando(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [estado, ambienteId, fecha, versionPeticion]);

  const reintentar = useCallback(() => {
    setCargando(true);
    setError("");
    setVersionPeticion((v) => v + 1);
  }, []);

  const actualizarFiltro = useCallback(
    (campo, valor) => {
      setCargando(true);
      const nuevos = new URLSearchParams(searchParams);
      if (valor) {
        nuevos.set(campo, valor);
      } else {
        nuevos.delete(campo);
      }
      setSearchParams(nuevos, { replace: true });
    },
    [searchParams, setSearchParams]
  );

  const hayFiltrosActivos = Boolean(estado || ambienteId || fecha);

  const limpiarFiltros = useCallback(() => {
    setCargando(true);
    setSearchParams({}, { replace: true });
  }, [setSearchParams]);

  const opcionesAmbiente = useMemo(() => {
    return [
      { value: "", label: "Todos" },
      ...ambientes.map((amb) => ({
        value: amb.id,
        label: amb.nombre,
      })),
    ];
  }, [ambientes]);

  const nombreAmbienteSeleccionado = useMemo(() => {
    if (!ambienteId) return "";
    const amb = ambientes.find((a) => a.id === ambienteId);
    return amb ? amb.nombre : ambienteId;
  }, [ambienteId, ambientes]);

  const columnas = useMemo(() => {
    const cols = [
      {
        key: "fecha",
        header: "Fecha",
        render: (row) => row.fecha,
      },
      {
        key: "horario",
        header: "Horario",
        render: (row) => (
          <span className="whitespace-nowrap font-medium text-slate-700">
            {row.horaInicio} – {row.horaFin}
          </span>
        ),
      },
      {
        key: "ambienteNombre",
        header: "Ambiente",
        render: (row) => (
          <span className="font-semibold text-slate-900">
            {row.ambienteNombre}
          </span>
        ),
      },
    ];

    // Solicitante solo visible para Administrador y ResponsableAmbiente
    if (usuario?.rol !== ROLES.SOLICITANTE) {
      cols.push({
        key: "solicitanteNombre",
        header: "Solicitante",
        render: (row) => (
          <span className="text-slate-800">{row.solicitanteNombre || "—"}</span>
        ),
      });
    }

    cols.push(
      {
        key: "estado",
        header: "Estado",
        render: (row) => <EstadoBadge estado={row.estado} />,
      },
      {
        key: "acciones",
        header: "Acción",
        render: (row) => (
          <Link
            to={`/reservas/${row.id}`}
            state={{ fromSearch: searchParams.toString() }}
            aria-label={`Ver detalle de la reserva del ${row.fecha} en ${row.ambienteNombre}`}
            className="inline-flex min-h-[36px] items-center rounded px-2.5 py-1 text-xs font-semibold text-upla-600 transition-colors hover:bg-upla-50 hover:text-upla-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-upla-500"
          >
            Ver detalle
          </Link>
        ),
      }
    );

    return cols;
  }, [usuario?.rol, searchParams]);

  const encabezadoSegunRol = useMemo(() => {
    switch (usuario?.rol) {
      case ROLES.ADMINISTRADOR:
        return {
          titulo: "Todas las reservas",
          ayuda:
            "Supervise, filtre y gestione todas las solicitudes de reserva de la universidad.",
        };
      case ROLES.RESPONSABLE_AMBIENTE:
        return {
          titulo: "Reservas de mis ambientes",
          ayuda:
            "Supervise y consulte las solicitudes de reserva para los ambientes a su cargo.",
        };
      case ROLES.SOLICITANTE:
      default:
        return {
          titulo: "Mis reservas",
          ayuda:
            "Consulte el estado, horario y detalle de sus solicitudes de reserva.",
        };
    }
  }, [usuario?.rol]);

  const puedeReservar =
    usuario?.rol === ROLES.SOLICITANTE ||
    usuario?.rol === ROLES.ADMINISTRADOR;

  const renderMensajeVacio = () => {
    if (hayFiltrosActivos) {
      return (
        <div className="space-y-3 px-4 py-6 text-center">
          <p className="text-sm text-slate-600">
            No hay reservas con estos filtros.
          </p>
          <Button
            variant="secondary"
            onClick={limpiarFiltros}
            className="text-xs"
          >
            Limpiar filtros
          </Button>
        </div>
      );
    }

    return (
      <div className="space-y-3 px-4 py-8 text-center">
        <p className="text-sm text-slate-600">
          No hay reservas registradas en el sistema.
        </p>
        {puedeReservar && (
          <div>
            <BotonEnlace to="/reservas/nueva" className="min-h-[40px] text-sm">
              Nueva reserva
            </BotonEnlace>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <EncabezadoPagina
        titulo={encabezadoSegunRol.titulo}
        descripcion={encabezadoSegunRol.ayuda}
      >
        {puedeReservar && (
          <BotonEnlace to="/reservas/nueva">Nueva reserva</BotonEnlace>
        )}
      </EncabezadoPagina>

      {/* Controles de filtro */}
      <div className="space-y-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <SelectInput
            id="filtroEstado"
            name="filtroEstado"
            label="Estado"
            value={estado}
            onChange={(e) => actualizarFiltro("estado", e.target.value)}
            options={OPCIONES_ESTADO}
          />

          <SelectInput
            id="filtroAmbiente"
            name="filtroAmbiente"
            label="Ambiente"
            value={ambienteId}
            onChange={(e) => actualizarFiltro("ambienteId", e.target.value)}
            options={opcionesAmbiente}
          />

          <DateInput
            id="filtroFecha"
            name="filtroFecha"
            label="Fecha"
            value={fecha}
            onChange={(e) => actualizarFiltro("fecha", e.target.value)}
          />
        </div>

        {/* Filtros activos visibles y botón Limpiar filtros */}
        {hayFiltrosActivos && (
          <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-2 text-xs">
            <div className="flex flex-wrap items-center gap-2 text-slate-600">
              <span className="font-semibold text-slate-800">
                Filtros activos:
              </span>
              {estado && (
                <span className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
                  Estado: {estado}
                </span>
              )}
              {ambienteId && (
                <span className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
                  Ambiente: {nombreAmbienteSeleccionado}
                </span>
              )}
              {fecha && (
                <span className="rounded border border-slate-300 bg-slate-100 px-2 py-0.5 font-medium text-slate-800">
                  Fecha: {fecha}
                </span>
              )}
            </div>

            <Button
              variant="secondary"
              onClick={limpiarFiltros}
              className="min-h-[32px] px-3 py-1 text-xs"
            >
              Limpiar filtros
            </Button>
          </div>
        )}
      </div>

      {/* Región aria-live con el contador de reservas */}
      <div className="flex items-center justify-between">
        <div
          role="status"
          aria-live="polite"
          className="text-sm font-semibold text-slate-700"
        >
          {cargando
            ? "Cargando reservas..."
            : `${reservas.length} ${reservas.length === 1 ? "reserva encontrada" : "reservas encontradas"}`}
        </div>
      </div>

      {error && (
        <AlertaErrorCarga
          title="Error al cargar reservas"
          message={error}
          onRetry={reintentar}
          onClose={() => setError("")}
        />
      )}

      {!error && (
        <TableList
          caption="Listado de reservas de ambientes universitarios"
          columns={columnas}
          rows={reservas}
          loading={cargando}
          emptyMessage={renderMensajeVacio()}
        />
      )}
    </div>
  );
}
