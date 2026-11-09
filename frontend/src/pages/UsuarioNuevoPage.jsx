import { useState, useEffect, useRef } from "react";
import TextInput from "../components/TextInput.jsx";
import SelectInput from "../components/SelectInput.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
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
  validarCorreo,
  validarContrasena,
} from "../utils/validators.js";
import { usuarioService } from "../services/usuarioService.js";
import { ETIQUETAS_ROL, OPCIONES_ROL } from "../utils/constantes.js";

const VALORES_INICIALES = {
  nombreCompleto: "",
  correo: "",
  rol: "",
  contrasena: "",
};

const ORDEN_CAMPOS = ["nombreCompleto", "correo", "rol", "contrasena"];

export default function UsuarioNuevoPage() {
  const { values, errors, handleChange, setErrors, reset } =
    useFormulario(VALORES_INICIALES);

  const [enviando, setEnviando] = useState(false);
  const [errorServidor, setErrorServidor] = useState("");
  const [exito, setExito] = useState(null);

  const alertErrorRef = useRef(null);

  useEffect(() => {
    document.title = "Registrar usuario | ReservaUPLA";
  }, []);

  const validar = (datos) => {    const nuevosErrores = {};

    const errorNombre =
      validarObligatorio(datos.nombreCompleto, "El nombre completo es obligatorio.") ||
      validarLongitudMinima(datos.nombreCompleto, 3, "El nombre completo debe tener entre 3 y 150 caracteres.") ||
      validarLongitudMaxima(datos.nombreCompleto, 150, "El nombre completo debe tener entre 3 y 150 caracteres.");
    if (errorNombre) nuevosErrores.nombreCompleto = errorNombre;

    const errorCorreo =
      validarObligatorio(datos.correo, "El correo electrónico es obligatorio.") ||
      validarCorreo(datos.correo, "El formato del correo electrónico no es válido.") ||
      validarLongitudMaxima(datos.correo, 150, "El correo electrónico no puede superar los 150 caracteres.");
    if (errorCorreo) nuevosErrores.correo = errorCorreo;

    const errorRol = validarObligatorio(datos.rol, "El rol es obligatorio.");
    if (errorRol) nuevosErrores.rol = errorRol;

    const errorContrasena =
      validarObligatorio(datos.contrasena, "La contraseña es obligatoria.") ||
      validarLongitudMinima(datos.contrasena, 8, "La contraseña debe tener entre 8 y 100 caracteres.") ||
      validarLongitudMaxima(datos.contrasena, 100, "La contraseña debe tener entre 8 y 100 caracteres.") ||
      validarContrasena(datos.contrasena, "La contraseña debe contener al menos una letra y un número.");
    if (errorContrasena) nuevosErrores.contrasena = errorContrasena;

    return nuevosErrores;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorServidor("");
    setExito(null);

    const datosNormalizados = {
      nombreCompleto: normalizeText(values.nombreCompleto),
      correo: normalizeText(values.correo),
      rol: normalizeText(values.rol),
      contrasena: normalizeText(values.contrasena),
    };

    const nuevosErrores = validar(datosNormalizados);
    if (Object.keys(nuevosErrores).length > 0) {
      setErrors(nuevosErrores);
      enfocarPrimerCampoConError(nuevosErrores, ORDEN_CAMPOS);
      return;
    }

    try {
      setEnviando(true);
      const creado = await usuarioService.crear(datosNormalizados);
      setExito({
        nombreCompleto: creado.nombreCompleto,
        correo: creado.correo,
        rol: creado.rol,
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
        titulo="Registrar usuario"
        descripcion="Ingrese los datos personales y el rol para registrar un nuevo usuario en la plataforma."
        className="mb-6"
      />

      <div className="space-y-4">
        {exito && (
          <AlertMessage
            type="success"
            title="Usuario registrado exitosamente"
            message={`El usuario ${exito.nombreCompleto} (${exito.correo}) ha sido registrado con el rol de ${ETIQUETAS_ROL[exito.rol] || exito.rol}.`}
            onClose={() => setExito(null)}
          />
        )}

        {errorServidor && (
          <div ref={alertErrorRef} tabIndex={-1} className="outline-none">
            <AlertMessage
              type="error"
              title="Error al registrar usuario"
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
            id="nombreCompleto"
            name="nombreCompleto"
            label="Nombre completo"
            value={values.nombreCompleto}
            onChange={handleChange}
            error={errors.nombreCompleto}
            placeholder="Ej. Juan Pérez González"
            required
            maxLength={150}
            disabled={enviando}
          />

          <TextInput
            id="correo"
            name="correo"
            type="email"
            label="Correo electrónico"
            value={values.correo}
            onChange={handleChange}
            error={errors.correo}
            placeholder="ejemplo@upla.edu.pe"
            required
            maxLength={150}
            disabled={enviando}
          />

          <SelectInput
            id="rol"
            name="rol"
            label="Rol"
            value={values.rol}
            onChange={handleChange}
            error={errors.rol}
            placeholder="Seleccione un rol"
            options={OPCIONES_ROL}
            required
            disabled={enviando}
          />

          <PasswordInput
            id="contrasena"
            name="contrasena"
            label="Contraseña"
            value={values.contrasena}
            onChange={handleChange}
            error={errors.contrasena}
            hint="Debe tener entre 8 y 100 caracteres, y contener al menos una letra y un número."
            required
            maxLength={100}
            disabled={enviando}
          />

          <div className="pt-2">
            <Button type="submit" loading={enviando} className="w-full sm:w-auto">
              Registrar usuario
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
