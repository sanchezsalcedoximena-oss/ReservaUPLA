import {
  createContext,
  useCallback,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

const CLAVE_TEMA = "reservaupla.tema";

function leerTemaInicial() {
  try {
    const guardado = window.localStorage.getItem(CLAVE_TEMA);

    if (guardado === "oscuro") {
      return "oscuro";
    }
  } catch {
    // El almacenamiento local puede no estar disponible.
  }

  return "claro";
}

// oxlint-disable-next-line react/only-export-components
export const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [tema, setTema] = useState(leerTemaInicial);
  const { pathname } = useLocation();
  const enLogin = pathname === "/login";

  useLayoutEffect(() => {
    const raiz = document.documentElement;
    const debeOscurecer = enLogin && tema === "oscuro";

    raiz.classList.toggle("dark", debeOscurecer);
    raiz.style.colorScheme = debeOscurecer ? "dark" : "light";

    return () => {
      raiz.classList.remove("dark");
      raiz.style.colorScheme = "";
    };
  }, [enLogin, tema]);

  const alternarTema = useCallback(() => {
    setTema((actual) => {
      const siguiente = actual === "oscuro" ? "claro" : "oscuro";

      try {
        window.localStorage.setItem(CLAVE_TEMA, siguiente);
      } catch {
        // El almacenamiento local puede no estar disponible.
      }

      return siguiente;
    });
  }, []);

  const valor = useMemo(
    () => ({ tema, esOscuro: tema === "oscuro", alternarTema }),
    [tema, alternarTema]
  );

  return (
    <TemaContext.Provider value={valor}>{children}</TemaContext.Provider>
  );
}
