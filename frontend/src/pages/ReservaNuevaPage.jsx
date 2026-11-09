import { useState, useEffect, useRef, useCallback } from "react";
import SelectInput from "../components/SelectInput.jsx";
import DateInput from "../components/DateInput.jsx";
import TimeInput from "../components/TimeInput.jsx";
import TextAreaInput from "../components/TextAreaInput.jsx";
import Button from "../components/Button.jsx";
import AlertMessage from "../components/AlertMessage.jsx";
import EncabezadoPagina from "../components/EncabezadoPagina.jsx";
import { useFormulario, mapearErroresServidor } from "../hooks/useFormulario.js";
import { enfocarPrimerCampoConError } from "../utils/formulario.js";
import { normalizeText } from "../utils/normalizeText.js";
import {
  validarObligatorio,
  validarLongitudMinima,
  validarLongitudMaxima,
  validarFechaNoAnteriorAHoy,
  validarHoraFinMayor,
  validarHoraEnHorarioPermitido,
  obtenerFechaHoyLocal,
} from "../utils/validators.js";
import { HORA_APERTURA, HORA_CIERRE } from "../utils/horarioReserva.js";
import { ambienteService } from "../services/ambienteService.js";
import { reservaService } from "../services/reservaService.js";

const VALORES_INICIALES = {
  ambienteId: "",
  fecha: "",
  horaInicio: "",
  horaFin: "",
  motivo: "",
};

const ORDEN_CAMPOS = ["ambienteId", "fecha", "horaInicio", "horaFin", "motivo"];

export default function ReservaNuevaPage() {
  const { values, errors, handleChange, setErrors, reset } =
    useFormulario(VALORES_INICIALES);

  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [exito, setExito] = useState(null);

  const [ambientes, setAmbientes] = useState([]);
  const [cargandoAmbientes, setCargandoAmbientes] = useState(true);
  const [errorCargaAmbientes, setErrorCargaAmbientes] = useState("");

  const alertErrorRef = useRef(null);
  const fechaHoy = obtenerFechaHoyLocal();

  useEffect(() => {
    document.title = "Nueva reserva | ReservaUPLA";
  }, []);

  const cargarAmbientes = useCallback(async () => {
    try {
      setCargandoAmbientes(true);
      setErrorCargaAmbientes("");
      const datos = await ambienteService.listar(true);
      setAmbientes(datos || []);
    } catch {
      setErrorCargaAmbientes("No se pudieron cargar los ambientes disponibles.");
    } finally {
      setCargandoAmbientes(false);
    }
  }, []);

  useEffect(() => {
    // La carga inicial consulta la API y actualiza el estado con la respuesta.
    // oxlint-disable-next-line react/set-state-in-effect
    cargarAmbientes();
  }, [cargarAmbientes]);

  const opcionesAmbientes = ambientes.map((amb) => ({
    value: amb.id,
    label: amb.nombre,
    description: `${amb.tipo} • Capacidad: ${amb.capacidad} personas • ${amb.ubicacion}`,
  }));

  const validar = (datos) => {
    const nuevosErrores = {};

    // RN-02: Ambiente disponible
    const errorAmbiente = validarObligatorio(
      datos.ambienteId,
      "Debe seleccionar un ambiente."
    );
    if (errorAmbiente) {
      nuevosErrores.ambienteId = errorAmbiente;
    } else if (!ambientes.some((a) => a.id === datos.ambienteId)) {
      nuevosErrores.ambienteId = "El ambiente seleccionado no está disponible.";
    }

    // Fecha no anterior a hoy
    const errorFecha =
      validarObligatorio(datos.fecha, "La fecha es obligatoria.") ||
      validarFechaNoAnteriorAHoy(
        datos.fecha,
        "La fecha de la reserva no puede ser anterior a la fecha actual."
      );
    if (errorFecha) nuevosErrores.fecha = errorFecha;

    // RN-04: Horario permitido (07:00 a 22:00)
    const errorHoraInicio =
      validarObligatorio(datos.horaInicio, "La hora de inicio es obligatoria.") ||
      validarHoraEnHorarioPermitido(
        datos.horaInicio,
        `La hora de inicio debe estar dentro del horario de atención (${HORA_APERTURA} a ${HORA_CIERRE}).`
      );
    if (errorHoraInicio) nuevosErrores.horaInicio = errorHoraInicio;

    // RN-03 y RN-04: Horario permitido y Fin > Inicio
    const errorHoraFin =
      validarObligatorio(datos.horaFin, "La hora de fin es obligatoria.") ||
      validarHoraEnHorarioPermitido(
        datos.horaFin,
        `La hora de fin debe estar dentro del horario de atención (${HORA_APERTURA} a ${HORA_CIERRE}).`
      );
    if (errorHoraFin) {
      nuevosErrores.horaFin = errorHoraFin;
    } else {
      const errorRango = validarHoraFinMayor(
        datos.horaInicio,
        datos.horaFin,
        "La hora de fin debe ser posterior a la hora de inicio."
      );
      if (errorRango) nuevosErrores.horaFin = errorRango;
    }

    // Motivo: 10 a 500 caracteres
    const errorMotivo =
      validarObligatorio(datos.motivo, "El motivo es obligatorio.") ||
      validarLongitudMinima(
        datos.motivo,
        10,
        "El motivo debe tener entre 10 y 500 caracteres."
      ) ||
      validarLongitudMaxima(
        datos.motivo,
        500,
        "El motivo debe tener entre 10 y 500 caracteres."
      );
    if (errorMotivo) nuevosErrores.motivo = errorMotivo;

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor("");
    setExito(null);

    const datosNormalizados = {
      ambienteId: values.ambienteId || "",
      fecha: values.fecha || "",
      horaInicio: values.horaInicio || "",
      horaFin: values.horaFin || "",
      motivo: normalizeText(values.motivo),
    };

    const nuevosErrores = validar(datosNormalizados);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      enfocarPrimerCampoConError(nuevosErrores, ORDEN_CAMPOS);
      return;
    }

    try {
      setEnviando(true);
      const creada = await reservaService.crear(datosNormalizados);
      const ambienteElegido = ambientes.find((a) => a.id === creada.ambienteId);
      setExito({
        ambienteNombre: ambienteElegido ? ambienteElegido.nombre : "Ambiente",
        fecha: creada.fecha,
        horaInicio: creada.horaInicio,
        horaFin: creada.horaFin,
        estado: creada.estado,
      });
      reset();
    } catch (err) {
      const { campos, general } = mapearErroresServidor(err, values);
      if (Object.keys(campos).length > 0) {
        setErrors(campos);
      }
      if (general) {
        setErrorServidor(general);
        setTimeout(() => alertErrorRef.current?.focus(), 0);
      } else if (Object.keys(campos).length > 0) {
        enfocarPrimerCampoConError(campos, ORDEN_CAMPOS);
      }
    } finally {
      setEnviando(false);
    }
  };

  const sinAmbientesDisponibles = !cargandoAmbientes && ambientes.length === 0;

  return (
    <div className="mx-auto max-w-2xl">
      <EncabezadoPagina
        titulo="Nueva reserva"
        descripcion="Complete los detalles para solicitar la reserva de un ambiente universitario."
        className="mb-6"
      />

      <div className="space-y-4">
        {exito && (
          <AlertMessage
            type="success"
            title="Reserva registrada exitosamente"
            message={`Su solicitud para «${exito.ambienteNombre}» el ${exito.fecha} (${exito.horaInicio} - ${exito.horaFin}) ha sido registrada con estado ${exito.estado}.`}
            onClose={() => setExito(null)}
          />
        )}

        {sinAmbientesDisponibles && (
          <AlertMessage
            type="warning"
            title="Ambientes no disponibles"
            message="No hay ambientes disponibles para realizar reservas en este momento."
          />
        )}

        {errorCargaAmbientes && (
          <AlertMessage
            type="error"
            title="Error al cargar ambientes"
            message={errorCargaAmbientes}
            onClose={() => setErrorCargaAmbientes("")}
          />
        )}

        {errorServidor && (
          <div ref={alertErrorRef} tabIndex={-1} className="outline-none">
            <AlertMessage
              type="error"
              title="Error al registrar reserva"
              message={errorServidor}
              onClose={() => setErrorServidor("")}
            />
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          noValidate
          className="bg-white border border-slate-200 rounded-lg p-6 shadow-sm space-y-5"
        >
          <SelectInput
            id="ambienteId"
            name="ambienteId"
            label="Ambiente"
            value={values.ambienteId}
            onChange={handleChange}
            error={errors.ambienteId}
            placeholder={
              cargandoAmbientes
                ? "Cargando ambientes..."
                : "Seleccione un ambiente"
            }
            options={opcionesAmbientes}
            loading={cargandoAmbientes}
            required
            disabled={enviando || cargandoAmbientes || sinAmbientesDisponibles}
          />

          <DateInput
            id="fecha"
            name="fecha"
            label="Fecha"
            value={values.fecha}
            onChange={handleChange}
            error={errors.fecha}
            min={fechaHoy}
            required
            disabled={enviando || sinAmbientesDisponibles}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TimeInput
              id="horaInicio"
              name="horaInicio"
              label="Hora de inicio"
              value={values.horaInicio}
              onChange={handleChange}
              error={errors.horaInicio}
              hint={`Horario permitido: ${HORA_APERTURA} a ${HORA_CIERRE}`}
              min={HORA_APERTURA}
              max={HORA_CIERRE}
              required
              disabled={enviando || sinAmbientesDisponibles}
            />

            <TimeInput
              id="horaFin"
              name="horaFin"
              label="Hora de fin"
              value={values.horaFin}
              onChange={handleChange}
              error={errors.horaFin}
              hint={`Horario permitido: ${HORA_APERTURA} a ${HORA_CIERRE}`}
              min={HORA_APERTURA}
              max={HORA_CIERRE}
              required
              disabled={enviando || sinAmbientesDisponibles}
            />
          </div>

          <TextAreaInput
            id="motivo"
            name="motivo"
            label="Motivo"
            rows={3}
            maxLength={500}
            value={values.motivo}
            onChange={handleChange}
            error={errors.motivo}
            placeholder="Describa el propósito de la reserva (entre 10 y 500 caracteres)..."
            hint="Mínimo 10 caracteres y máximo 500 caracteres."
            required
            disabled={enviando || sinAmbientesDisponibles}
          />

          <div className="pt-2">
            <Button
              type="submit"
              loading={enviando}
              disabled={sinAmbientesDisponibles || cargandoAmbientes}
              className="w-full sm:w-auto"
            >
              Solicitar reserva
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
