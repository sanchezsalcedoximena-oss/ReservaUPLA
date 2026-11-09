import { useState, useEffect, useCallback, useMemo } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import Button from "../components/Button.jsx";
import AlertMessage from "../components/AlertMessage.jsx";
import AlertaErrorCarga from "../components/AlertaErrorCarga.jsx";
import ModalConfirmacion from "../components/ModalConfirmacion.jsx";
import Spinner from "../components/Spinner.jsx";
import EstadoBadge from "../components/EstadoBadge.jsx";
import { reservaService } from "../services/reservaService.js";
import { ACCIONES_RESERVA, ESTADOS_RESERVA } from "../utils/constantes.js";

const ESTADO_POR_ACCION = {
  [ACCIONES_RESERVA.APROBAR]: ESTADOS_RESERVA.APROBADA,
  [ACCIONES_RESERVA.RECHAZAR]: ESTADOS_RESERVA.RECHAZADA,
  [ACCIONES_RESERVA.CANCELAR]: ESTADOS_RESERVA.CANCELADA,
};

const MENSAJE_EXITO_POR_ESTADO = {
  [ESTADOS_RESERVA.APROBADA]: "Reserva aprobada exitosamente.",
  [ESTADOS_RESERVA.RECHAZADA]: "Reserva rechazada exitosamente.",
  [ESTADOS_RESERVA.CANCELADA]: "Reserva cancelada exitosamente.",
};

export default function ReservaDetallePage() {
  const { id } = useParams();
  const location = useLocation();

  const [detalle, setDetalle] = useState(null);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState(null); // { status, message }
  const [versionPeticion, setVersionPeticion] = useState(0);

  const [accionSeleccionada, setAccionSeleccionada] = useState(null); // 'Aprobar' | 'Rechazar' | 'Cancelar' | null
  const [procesandoAccion, setProcesandoAccion] = useState(false);
  const [mensajeExito, setMensajeExito] = useState("");
  const [errorAccion, setErrorAccion] = useState("");

  const searchParamsPrevios = location.state?.fromSearch || "";
  const rutaRetorno = searchParamsPrevios
    ? `/reservas?${searchParamsPrevios}`
    : "/reservas";

  useEffect(() => {
    document.title = "Detalle de reserva | ReservaUPLA";
  }, []);

  useEffect(() => {
    const controller = new AbortController();

    reservaService
      .obtener(id, { signal: controller.signal })
      .then((datos) => {
        if (!controller.signal.aborted) {
          setDetalle(datos);
          setErrorCarga(null);
          setCargando(false);
        }
      })
      .catch((err) => {
        if (!controller.signal.aborted) {
          setErrorCarga({
            status: err.status ?? 0,
            message: err.message || "Error al cargar el detalle de la reserva.",
          });
          setCargando(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, [id, versionPeticion]);

  const reintentar = useCallback(() => {
    setCargando(true);
    setErrorCarga(null);
    setVersionPeticion((v) => v + 1);
  }, []);

  const abrirModal = (accion) => {
    setErrorAccion("");
    setMensajeExito("");
    setAccionSeleccionada(accion);
  };

  const cerrarModal = () => {
    if (!procesandoAccion) {
      setAccionSeleccionada(null);
    }
  };

  const handleConfirmarAccion = async () => {
    if (!accionSeleccionada || !detalle) return;

    const mapaEstado = ESTADO_POR_ACCION;

    const nuevoEstado = mapaEstado[accionSeleccionada];
    if (!nuevoEstado) return;

    try {
      setProcesandoAccion(true);
      setErrorAccion("");
      setMensajeExito("");

      const dtoActualizado = await reservaService.cambiarEstado(
        detalle.id,
        nuevoEstado
      );
      setDetalle(dtoActualizado);

      const mensajesExito = MENSAJE_EXITO_POR_ESTADO;
      setMensajeExito(
        mensajesExito[nuevoEstado] || "Estado actualizado exitosamente."
      );
      setAccionSeleccionada(null);
    } catch (err) {
      // 409, 400, 403 se muestran en AlertMessage sin salir de la pantalla
      setErrorAccion(
        err.message || "No se pudo actualizar el estado de la reserva."
      );
      setAccionSeleccionada(null);
    } finally {
      setProcesandoAccion(false);
    }
  };

  const modalConfig = useMemo(() => {
    if (!accionSeleccionada || !detalle) return {};

    switch (accionSeleccionada) {
      case ACCIONES_RESERVA.APROBAR:
        return {
          title: "Aprobar reserva",
          message: `¿Aprobar la reserva del ${detalle.fecha} de ${detalle.horaInicio} a ${detalle.horaFin} en ${detalle.ambienteNombre}?`,
          confirmLabel: "Aprobar",
          variant: "primary",
        };
      case ACCIONES_RESERVA.RECHAZAR:
        return {
          title: "Rechazar reserva",
          message: `¿Rechazar la reserva del ${detalle.fecha} de ${detalle.horaInicio} a ${detalle.horaFin} en ${detalle.ambienteNombre}?`,
          confirmLabel: "Rechazar",
          variant: "danger",
        };
      case ACCIONES_RESERVA.CANCELAR:
        return {
          title: "Cancelar reserva",
          message: `¿Cancelar la reserva del ${detalle.fecha} de ${detalle.horaInicio} a ${detalle.horaFin} en ${detalle.ambienteNombre}?`,
          confirmLabel: "Cancelar reserva",
          variant: "danger",
        };
      default:
        return {};
    }
  }, [accionSeleccionada, detalle]);

  if (cargando) {
    return (
      <div
        className="min-h-[300px] flex flex-col items-center justify-center gap-3"
        role="status"
        aria-label="Cargando detalle de la reserva"
      >
        <h1 className="sr-only">Detalle de la reserva</h1>
        <Spinner size="lg" className="text-upla-500" />
        <p className="text-sm text-slate-600 font-medium">
          Cargando detalle de la reserva...
        </p>
      </div>
    );
  }

  // 404 o fuera de alcance
  if (errorCarga?.status === 404 || errorCarga?.status === 403) {
    return (
      <div className="max-w-xl mx-auto py-8">
        <div className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm text-center space-y-4">
          <h1 className="text-xl font-bold text-slate-900">
            Reserva no encontrada
          </h1>
          <p className="text-sm text-slate-600">
            La reserva solicitada no existe o no tiene permisos suficientes para
            consultarla.
          </p>
          <div>
            <Link
              to={rutaRetorno}
              className="inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-medium rounded-md bg-upla-500 text-white hover:bg-upla-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-upla-500"
            >
              Volver al listado
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Otro error de carga
  if (errorCarga) {
    return (
      <div className="mx-auto max-w-2xl space-y-4 py-6">
        <h1 className="sr-only">Detalle de la reserva</h1>
        <AlertaErrorCarga
          title="Error al cargar la reserva"
          message={errorCarga.message}
          onRetry={reintentar}
        />
        <div>
          <Link
            to={rutaRetorno}
            className="inline-flex min-h-[40px] items-center justify-center rounded-md border border-campo bg-white px-3.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-upla-500"
          >
            ← Volver al listado
          </Link>
        </div>
      </div>
    );
  }

  if (!detalle) return null;

  const accionesPermitidas = Array.isArray(detalle.accionesPermitidas)
    ? detalle.accionesPermitidas
    : [];

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Enlace de regreso preservando filtros */}
      <div>
        <Link
          to={rutaRetorno}
          className="inline-flex items-center gap-1.5 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-upla-500 rounded p-1"
        >
          <span aria-hidden="true">←</span> Volver al listado
        </Link>
      </div>

      {/* Alertas de resultado de cambio de estado o errores */}
      {mensajeExito && (
        <AlertMessage
          type="success"
          title="Operación exitosa"
          message={mensajeExito}
          onClose={() => setMensajeExito("")}
        />
      )}

      {errorAccion && (
        <AlertMessage
          type="error"
          title="No se pudo cambiar el estado"
          message={errorAccion}
          onClose={() => setErrorAccion("")}
        />
      )}

      {/* Ficha descriptiva principal con dl */}
      <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-slate-50">
          <div>
            <h1 className="text-xl font-bold text-slate-900">
              Detalle de la reserva
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              ID: {detalle.id}
            </p>
          </div>
          <div>
            <EstadoBadge estado={detalle.estado} />
          </div>
        </div>

        <dl className="divide-y divide-slate-100 text-sm">
          <div className="px-6 py-3.5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Fecha</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-slate-900 font-semibold">
              {detalle.fecha}
            </dd>
          </div>

          <div className="px-6 py-3.5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Horario</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-slate-900">
              {detalle.horaInicio} – {detalle.horaFin}
            </dd>
          </div>

          <div className="px-6 py-3.5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Ambiente</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-slate-900 space-y-0.5">
              <span className="font-semibold block">{detalle.ambienteNombre}</span>
              <span className="text-slate-600 block text-xs">
                {detalle.ambienteTipo} • {detalle.ambienteUbicacion} • Capacidad: {detalle.ambienteCapacidad} personas
              </span>
            </dd>
          </div>

          <div className="px-6 py-3.5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Solicitante</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-slate-900">
              <span className="font-semibold block">{detalle.solicitanteNombre}</span>
              <span className="text-slate-600 text-xs">{detalle.solicitanteCorreo}</span>
            </dd>
          </div>

          <div className="px-6 py-3.5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Motivo</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2 text-slate-800 whitespace-pre-wrap leading-relaxed">
              {detalle.motivo}
            </dd>
          </div>

          <div className="px-6 py-3.5 sm:grid sm:grid-cols-3 sm:gap-4">
            <dt className="font-medium text-slate-500">Estado</dt>
            <dd className="mt-1 sm:mt-0 sm:col-span-2">
              <EstadoBadge estado={detalle.estado} />
            </dd>
          </div>
        </dl>

        {/* Botones de acción según AccionesPermitidas */}
        {accionesPermitidas.length > 0 && (
          <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-3">
            {accionesPermitidas.includes(ACCIONES_RESERVA.APROBAR) && (
              <Button
                variant="primary"
                onClick={() => abrirModal(ACCIONES_RESERVA.APROBAR)}
              >
                Aprobar
              </Button>
            )}

            {accionesPermitidas.includes(ACCIONES_RESERVA.RECHAZAR) && (
              <Button
                variant="danger"
                onClick={() => abrirModal(ACCIONES_RESERVA.RECHAZAR)}
              >
                Rechazar
              </Button>
            )}

            {accionesPermitidas.includes(ACCIONES_RESERVA.CANCELAR) && (
              <Button
                variant="danger"
                onClick={() => abrirModal(ACCIONES_RESERVA.CANCELAR)}
              >
                Cancelar reserva
              </Button>
            )}
          </div>
        )}
      </div>

      {/* Modal de confirmación */}
      <ModalConfirmacion
        open={Boolean(accionSeleccionada)}
        title={modalConfig.title || "Confirmar acción"}
        message={modalConfig.message || "¿Desea confirmar esta acción?"}
        confirmLabel={modalConfig.confirmLabel || "Confirmar"}
        variant={modalConfig.variant || "primary"}
        loading={procesandoAccion}
        onConfirm={handleConfirmarAccion}
        onCancel={cerrarModal}
      />
    </div>
  );
}
