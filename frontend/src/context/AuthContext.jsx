import { createContext, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { setUnauthorizedHandler } from "../services/apiClient.js";
import authService from "../services/authService.js";

// oxlint-disable-next-line react/only-export-components
export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [cargando, setCargando] = useState(true);
  const navigate = useNavigate();
  const usuarioRef = useRef(null);

  useEffect(() => {
    usuarioRef.current = usuario;
  }, [usuario]);

  useEffect(() => {
    setUnauthorizedHandler(() => {
      if (!usuarioRef.current) {
        return;
      }

      setUsuario(null);
      navigate("/login", { replace: true });
    });

    return () => setUnauthorizedHandler(null);
  }, [navigate]);

  useEffect(() => {
    let isMounted = true;

    async function cargarSesionInicial() {
      try {
        const datosUsuario = await authService.obtenerSesion();
        if (isMounted) {
          setUsuario(datosUsuario);
        }
      } catch {
        if (isMounted) {
          setUsuario(null);
        }
      } finally {
        if (isMounted) {
          setCargando(false);
        }
      }
    }

    cargarSesionInicial();

    return () => {
      isMounted = false;
    };
  }, []);

  const iniciarSesion = async (correo, contrasena) => {
    const datosUsuario = await authService.login(correo, contrasena);
    setUsuario(datosUsuario);
    return datosUsuario;
  };

  const cerrarSesion = async () => {
    try {
      await authService.logout();
    } finally {
      setUsuario(null);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        usuario,
        cargando,
        iniciarSesion,
        cerrarSesion,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// oxlint-disable-next-line react/only-export-components
export { useAuth } from "./useAuth.js";
export default AuthContext;
