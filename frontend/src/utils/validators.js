import { HORA_APERTURA, HORA_CIERRE } from "./horarioReserva.js";

export function obtenerFechaHoyLocal() {
  const hoy = new Date();
  const anio = hoy.getFullYear();
  const mes = String(hoy.getMonth() + 1).padStart(2, "0");
  const dia = String(hoy.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}

export function validarObligatorio(valor, mensaje = "Este campo es obligatorio.") {
  if (valor === null || valor === undefined) return mensaje;
  if (typeof valor === "string" && valor.trim() === "") return mensaje;
  if (Array.isArray(valor) && valor.length === 0) return mensaje;
  return "";
}

export function validarLongitudMinima(valor, min, mensaje = `Debe tener al menos ${min} caracteres.`) {
  if (valor === null || valor === undefined || valor === "") return "";
  const str = String(valor);
  return str.length < min ? mensaje : "";
}

export function validarLongitudMaxima(valor, max, mensaje = `No puede superar los ${max} caracteres.`) {
  if (valor === null || valor === undefined || valor === "") return "";
  const str = String(valor);
  return str.length > max ? mensaje : "";
}

export function validarCorreo(valor, mensaje = "El formato del correo electrónico no es válido.") {
  if (!valor) return "";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(String(valor).trim()) ? "" : mensaje;
}

export function validarEnteroEnRango(
  valor,
  min,
  max,
  mensaje = `Debe ser un número entero entre ${min} y ${max}.`
) {
  if (valor === null || valor === undefined || valor === "") return "";
  const str = String(valor).trim();
  if (!/^-?\d+$/.test(str)) return mensaje;
  const num = parseInt(str, 10);
  if (Number.isNaN(num) || num < min || num > max) return mensaje;
  return "";
}

export function validarContrasena(
  valor,
  mensaje = "La contraseña debe contener al menos una letra y un número."
) {
  if (!valor) return "";
  const regex = /^(?=.*[a-zA-Z])(?=.*\d).+$/;
  return regex.test(String(valor)) ? "" : mensaje;
}

export function validarHoraFinMayor(
  horaInicio,
  horaFin,
  mensaje = "La hora de fin debe ser posterior a la hora de inicio."
) {
  if (!horaInicio || !horaFin) return "";
  return horaFin <= horaInicio ? mensaje : "";
}

export function validarHoraEnHorarioPermitido(
  hora,
  mensaje = `El horario permitido es de ${HORA_APERTURA} a ${HORA_CIERRE}.`
) {
  if (!hora) return "";
  if (hora < HORA_APERTURA || hora > HORA_CIERRE) {
    return mensaje;
  }
  return "";
}

export function validarFechaNoAnteriorAHoy(
  fecha,
  mensaje = "La fecha de la reserva no puede ser anterior a la fecha actual."
) {
  if (!fecha) return "";
  const hoyStr = obtenerFechaHoyLocal();
  return fecha < hoyStr ? mensaje : "";
}
