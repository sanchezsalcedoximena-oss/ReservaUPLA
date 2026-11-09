import { useState, useCallback } from "react";

export function useFormulario(valoresIniciales = {}) {
  const [values, setValues] = useState(valoresIniciales);
  const [errors, setErrors] = useState({});

  const handleChange = useCallback((e, valorDirecto) => {
    let name;
    let value;

    if (e && e.target) {
      name = e.target.name;
      value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    } else if (typeof e === "string") {
      name = e;
      value = valorDirecto;
    }

    if (!name) return;

    setValues((prev) => ({
      ...prev,
      [name]: value,
    }));

    setErrors((prev) => {
      if (!prev[name]) return prev;
      const actualizados = { ...prev };
      delete actualizados[name];
      return actualizados;
    });
  }, []);

  const reset = useCallback((nuevosValores = valoresIniciales) => {
    setValues(nuevosValores);
    setErrors({});
  }, [valoresIniciales]);

  return {
    values,
    errors,
    handleChange,
    setErrors,
    reset,
  };
}

export function mapearErroresServidor(error, formValues = {}) {
  if (!error) {
    return { campos: {}, general: "" };
  }

  const campos = {};
  const noMapeados = [];
  const keys = Object.keys(formValues);

  if (error.errors && typeof error.errors === "object") {
    Object.entries(error.errors).forEach(([backendKey, mensajes]) => {
      const msg = Array.isArray(mensajes) ? mensajes.join(" ") : String(mensajes);
      const cleanKey = backendKey.includes(".") ? backendKey.split(".").pop() : backendKey;
      const matchedKey = keys.find((k) => k.toLowerCase() === cleanKey.toLowerCase());
      if (matchedKey) {
        campos[matchedKey] = msg;
      } else {
        noMapeados.push(msg);
      }
    });
  }

  let general = "";
  if (error.status === 409) {
    general = error.message;
  } else if (noMapeados.length > 0) {
    general = noMapeados.join(" ");
  } else if (Object.keys(campos).length === 0 && error.message) {
    general = error.message;
  }

  return { campos, general };
}
