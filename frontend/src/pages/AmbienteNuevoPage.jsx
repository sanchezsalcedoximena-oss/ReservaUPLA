import { useState, useEffect, useRef, useCallback } from "react";
import TextInput from "../components/TextInput.jsx";
import SelectInput from "../components/SelectInput.jsx";
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
  validarEnteroEnRango,
} from "../utils/validators.js";
import { ambienteService } from "../services/ambienteService.js";
import { usuarioService } from "../services/usuarioService.js";
import { OPCIONES_TIPO_AMBIENTE } from "../utils/constantes.js";

const VALORES_INICIALES = {
  nombre: "",
  tipo: "",
  capacidad: "",
  ubicacion: "",
  responsableId: "",
};

const ORDEN_CAMPOS = ["nombre", "tipo", "capacidad", "ubicacion", "responsableId"];

export default function AmbienteNuevoPage() {
  const { values, errors, handleChange, setErrors, reset } =
    useFormulario(VALORES_INICIALES);

  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [exito, setExito] = useState(null);

  const [responsables, setResponsables] = useState([]);
  const [cargandoResponsables, setCargandoResponsables] = useState(true);
  const [errorCargaResponsables, setErrorCargaResponsables] = useState("");

  const alertErrorRef = useRef(null);

  useEffect(() => {
    document.title = "Registrar ambiente | ReservaUPLA";
  }, []);

  const cargarResponsables = useCallback(async () => {
    try {
      setCargandoResponsables(true);
      setErrorCargaResponsables("");
      const datos = await usuarioService.listar("ResponsableAmbiente");
      setResponsables(datos || []);
    } catch {
      setErrorCargaResponsables("No se pudieron cargar los responsables de ambiente disponibles.");
    } finally {
      setCargandoResponsables(false);
    }
  }, []);

  useEffect(() => {
    // La carga inicial consulta la API y actualiza el estado con la respuesta.
    // oxlint-disable-next-line react/set-state-in-effect
    cargarResponsables();
  }, [cargarResponsables]);

  const opcionesResponsable = [
    { value: "", label: "Sin responsable" },
    ...responsables.map((r) => ({
      value: r.id,
      label: r.nombreCompleto,
    })),
  ];

  const validar = (datos) => {
    const nuevosErrores = {};

    const errorNombre =
      validarObligatorio(datos.nombre, "El nombre es obligatorio.") ||
      validarLongitudMinima(datos.nombre, 3, "El nombre debe tener entre 3 y 100 caracteres.") ||
      validarLongitudMaxima(datos.nombre, 100, "El nombre debe tener entre 3 y 100 caracteres.");
    if (errorNombre) nuevosErrores.nombre = errorNombre;

    const errorTipo = validarObligatorio(datos.tipo, "El tipo de ambiente es obligatorio.");
    if (errorTipo) nuevosErrores.tipo = errorTipo;

    const errorCapacidad =
      validarObligatorio(datos.capacidad, "La capacidad es obligatoria.") ||
      validarEnteroEnRango(datos.capacidad, 1, 1000, "La capacidad debe ser un número entero entre 1 y 1000.");
    if (errorCapacidad) nuevosErrores.capacidad = errorCapacidad;

    const errorUbicacion =
      validarObligatorio(datos.ubicacion, "La ubicación es obligatoria.") ||
      validarLongitudMinima(datos.ubicacion, 3, "La ubicación debe tener entre 3 y 100 caracteres.") ||
      validarLongitudMaxima(datos.ubicacion, 100, "La ubicación debe tener entre 3 y 100 caracteres.");
    if (errorUbicacion) nuevosErrores.ubicacion = errorUbicacion;

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor("");
    setExito(null);

    const datosNormalizados = {
      nombre: normalizeText(values.nombre),
      tipo: normalizeText(values.tipo),
      capacidad: normalizeText(values.capacidad),
      ubicacion: normalizeText(values.ubicacion),
      responsableId: values.responsableId || "",
    };

    const nuevosErrores = validar(datosNormalizados);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      enfocarPrimerCampoConError(nuevosErrores, ORDEN_CAMPOS);
      return;
    }

    try {
      setEnviando(true);
      const payload = {
        nombre: datosNormalizados.nombre,
        tipo: datosNormalizados.tipo,
        capacidad: parseInt(datosNormalizados.capacidad, 10),
        ubicacion: datosNormalizados.ubicacion,
        responsableId: datosNormalizados.responsableId ? datosNormalizados.responsableId : null,
      };

      const creado = await ambienteService.crear(payload);
      setExito({
        nombre: creado.nombre,
        tipo: creado.tipo,
        capacidad: creado.capacidad,
        ubicacion: creado.ubicacion,
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

  return (
    <div className="mx-auto max-w-2xl">
      <EncabezadoPagina
        titulo="Registrar ambiente"
        descripcion="Registre un nuevo espacio físico para habilitarlo en el catálogo de reservas de la universidad."
        className="mb-6"
      />

      <div className="space-y-4">
        {exito && (
          <AlertMessage
            type="success"
            title="Ambiente registrado exitosamente"
            message={`El ambiente «${exito.nombre}» (${exito.tipo}) con capacidad para ${exito.capacidad} personas ha sido registrado en ${exito.ubicacion}.`}
            onClose={() => setExito(null)}
          />
        )}

        {errorCargaResponsables && (
          <AlertMessage
            type="warning"
            title="Aviso de carga"
            message={errorCargaResponsables}
            onClose={() => setErrorCargaResponsables("")}
          />
        )}

        {errorServidor && (
          <div ref={alertErrorRef} tabIndex={-1} className="outline-none">
            <AlertMessage
              type="error"
              title="Error al registrar ambiente"
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
          <TextInput
            id="nombre"
            name="nombre"
            label="Nombre"
            value={values.nombre}
            onChange={handleChange}
            error={errors.nombre}
            placeholder="Ej. Laboratorio de Redes 101"
            required
            maxLength={100}
            disabled={enviando}
          />

          <SelectInput
            id="tipo"
            name="tipo"
            label="Tipo de ambiente"
            value={values.tipo}
            onChange={handleChange}
            error={errors.tipo}
            placeholder="Seleccione un tipo de ambiente"
            options={OPCIONES_TIPO_AMBIENTE}
            required
            disabled={enviando}
          />

          <TextInput
            id="capacidad"
            name="capacidad"
            type="number"
            min="1"
            max="1000"
            step="1"
            label="Capacidad"
            value={values.capacidad}
            onChange={handleChange}
            error={errors.capacidad}
            placeholder="Ej. 40"
            hint="Capacidad máxima de personas (entero entre 1 y 1000)"
            required
            disabled={enviando}
          />

          <TextInput
            id="ubicacion"
            name="ubicacion"
            label="Ubicación"
            value={values.ubicacion}
            onChange={handleChange}
            error={errors.ubicacion}
            placeholder="Ej. Pabellón B - Piso 2"
            required
            maxLength={100}
            disabled={enviando}
          />

          <SelectInput
            id="responsableId"
            name="responsableId"
            label="Responsable"
            value={values.responsableId}
            onChange={handleChange}
            error={errors.responsableId}
            options={opcionesResponsable}
            loading={cargandoResponsables}
            hint="Opcional. Seleccione un usuario con rol de Responsable de Ambiente."
            disabled={enviando || cargandoResponsables}
          />

          <div className="pt-2">
            <Button type="submit" loading={enviando} className="w-full sm:w-auto">
              Registrar ambiente
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
