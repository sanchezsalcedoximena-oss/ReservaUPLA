import { useCallback, useState } from "react";

export const TOTAL_DIAPOSITIVAS = 3;

function diapositivaSegunValores(correo, contrasena, focoEnContrasena = false) {
  const hayCorreo = correo.trim().length > 0;
  const hayContrasena = contrasena.length > 0;

  if (hayCorreo && hayContrasena) {
    return 2;
  }

  if (hayCorreo || hayContrasena || focoEnContrasena) {
    return 1;
  }

  return 0;
}

export function useSincronizacionCarrusel({ correo, contrasena }) {
  const [diapositivaActiva, setDiapositivaActiva] = useState(0);

  const aplicarDiapositiva = useCallback((siguiente) => {
    setDiapositivaActiva((actual) =>
      actual === siguiente ? actual : siguiente
    );
  }, []);

  const evaluar = useCallback(
    (campo, tipoEvento) => {
      const focoEnContrasena =
        tipoEvento === "focus" && campo === "contrasena";

      aplicarDiapositiva(
        diapositivaSegunValores(correo, contrasena, focoEnContrasena)
      );
    },
    [aplicarDiapositiva, correo, contrasena]
  );

  const manejarFoco = useCallback(
    (campo) => {
      evaluar(campo, "focus");
    },
    [evaluar]
  );

  const manejarDesenfoque = useCallback(
    (campo) => {
      evaluar(campo, "blur");
    },
    [evaluar]
  );

  // Retoma la sincronización en cuanto cambia el contenido de los campos,
  // aunque la persona haya elegido antes una diapositiva con los puntos.
  const sincronizarPorValores = useCallback(
    (nuevoCorreo, nuevaContrasena) => {
      aplicarDiapositiva(
        diapositivaSegunValores(nuevoCorreo, nuevaContrasena)
      );
    },
    [aplicarDiapositiva]
  );

  const seleccionarDiapositiva = useCallback((indice) => {
    if (!Number.isInteger(indice)) {
      return;
    }

    const indiceValido = Math.min(
      Math.max(indice, 0),
      TOTAL_DIAPOSITIVAS - 1
    );

    setDiapositivaActiva(indiceValido);
  }, []);

  return {
    diapositivaActiva,
    manejarFoco,
    manejarDesenfoque,
    sincronizarPorValores,
    seleccionarDiapositiva,
  };
}
