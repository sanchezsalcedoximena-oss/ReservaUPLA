import { useEffect, useRef, useState } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth.js";
import TextInput from "../components/TextInput.jsx";
import PasswordInput from "../components/PasswordInput.jsx";
import Button from "../components/Button.jsx";
import AlertMessage from "../components/AlertMessage.jsx";
import InterruptorTema from "../components/InterruptorTema.jsx";
import PanelInstitucional from "../components/login/PanelInstitucional.jsx";
import { useSincronizacionCarrusel } from "../hooks/useSincronizacionCarrusel.js";
import { normalizeText } from "../utils/normalizeText.js";

const CORREO_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CLAVE_CORREO_RECORDADO = "reservaupla.correoRecordado";

function leerCorreoRecordado() {
  try {
    return window.localStorage.getItem(CLAVE_CORREO_RECORDADO) ?? "";
  } catch {
    return "";
  }
}

function validarCorreo(valor) {
  const limpio = normalizeText(valor);

  if (!limpio) {
    return "El correo es obligatorio.";
  }

  if (!CORREO_REGEX.test(limpio)) {
    return "El correo no tiene un formato válido.";
  }

  return null;
}

function validarContrasena(valor) {
  if (!valor) {
    return "La contraseña es obligatoria.";
  }

  return null;
}

function IconoSobre() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="5" width="18" height="14" rx="2.5" />
      <path d="m4 7 8 6 8-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconoCandado() {
  return (
    <svg
      className="h-5 w-5"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="4" y="10" width="16" height="11" rx="2.5" />
      <path d="M8 10V8a4 4 0 0 1 8 0v2" strokeLinecap="round" />
      <path d="M12 14v3" strokeLinecap="round" />
    </svg>
  );
}

function IconoFlecha() {
  return (
    <svg
      className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-[3px] motion-reduce:transition-none motion-reduce:group-hover:transform-none"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="M5 12h14" strokeLinecap="round" />
      <path
        d="m13 6 6 6-6 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { usuario, iniciarSesion } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const temporizadorRedireccion = useRef(null);

  const [correo, setCorreo] = useState(leerCorreoRecordado);
  const [contrasena, setContrasena] = useState("");
  const [recordarCorreo, setRecordarCorreo] = useState(
    () => leerCorreoRecordado().length > 0
  );
  const [errores, setErrores] = useState({});
  const [camposTocados, setCamposTocados] = useState({
    correo: false,
    contrasena: false,
  });
  const [intentoEnvio, setIntentoEnvio] = useState(false);
  const [errorServidor, setErrorServidor] = useState(null);
  const [mostrarAyudaContrasena, setMostrarAyudaContrasena] = useState(false);
  const [anuncioLive, setAnuncioLive] = useState("");
  const [enviando, setEnviando] = useState(false);

  const {
    diapositivaActiva,
    manejarFoco,
    manejarDesenfoque,
    sincronizarPorValores,
    seleccionarDiapositiva,
  } = useSincronizacionCarrusel({ correo, contrasena });

  const destino = location.state?.from?.pathname || "/";

  useEffect(() => {
    document.title = "Iniciar sesión | ReservaUPLA";
  }, []);

  useEffect(
    () => () => {
      if (temporizadorRedireccion.current) {
        window.clearTimeout(temporizadorRedireccion.current);
      }
    },
    []
  );

  if (usuario && !enviando) {
    return <Navigate to={destino} replace />;
  }

  const mostrarErrorCorreo =
    (intentoEnvio || camposTocados.correo) && errores.correo
      ? errores.correo
      : null;
  const mostrarErrorContrasena =
    (intentoEnvio || camposTocados.contrasena) && errores.contrasena
      ? errores.contrasena
      : null;

  const handleCorreoFocus = () => {
    manejarFoco("correo");
  };

  const handleCorreoBlur = () => {
    setCamposTocados((prev) => ({ ...prev, correo: true }));
    setErrores((prev) => ({ ...prev, correo: validarCorreo(correo) }));
    manejarDesenfoque("correo");
  };

  const handleCorreoChange = (evento) => {
    const valor = evento.target.value;
    setCorreo(valor);
    sincronizarPorValores(valor, contrasena);

    if (intentoEnvio || camposTocados.correo) {
      setErrores((prev) => ({ ...prev, correo: validarCorreo(valor) }));
    }
  };

  const handleContrasenaFocus = () => {
    manejarFoco("contrasena");
  };

  const handleContrasenaBlur = () => {
    setCamposTocados((prev) => ({ ...prev, contrasena: true }));
    setErrores((prev) => ({
      ...prev,
      contrasena: validarContrasena(contrasena),
    }));
    manejarDesenfoque("contrasena");
  };

  const handleContrasenaChange = (evento) => {
    const valor = evento.target.value;
    setContrasena(valor);
    sincronizarPorValores(correo, valor);

    if (intentoEnvio || camposTocados.contrasena) {
      setErrores((prev) => ({
        ...prev,
        contrasena: validarContrasena(valor),
      }));
    }
  };

  const handleRecordarCorreo = (evento) => {
    const marcado = evento.target.checked;
    setRecordarCorreo(marcado);

    if (!marcado) {
      try {
        window.localStorage.removeItem(CLAVE_CORREO_RECORDADO);
      } catch {
        // El almacenamiento local puede no estar disponible.
      }
    }
  };

  const handleSubmit = async (evento) => {
    evento.preventDefault();

    if (enviando) {
      return;
    }

    setErrorServidor(null);
    setIntentoEnvio(true);
    setCamposTocados({ correo: true, contrasena: true });

    const nuevosErrores = {
      correo: validarCorreo(correo),
      contrasena: validarContrasena(contrasena),
    };

    setErrores(nuevosErrores);

    if (nuevosErrores.correo || nuevosErrores.contrasena) {
      setAnuncioLive(
        "Error en el formulario. Revisa los campos marcados como obligatorios."
      );

      const primerCampoConError = nuevosErrores.correo
        ? "correo"
        : "contrasena";
      document.getElementById(primerCampoConError)?.focus();
      return;
    }

    setEnviando(true);
    setAnuncioLive("Validando credenciales, por favor espere.");

    try {
      const correoLimpio = normalizeText(correo);
      await iniciarSesion(correoLimpio, contrasena);

      try {
        if (recordarCorreo) {
          window.localStorage.setItem(
            CLAVE_CORREO_RECORDADO,
            correoLimpio
          );
        } else {
          window.localStorage.removeItem(CLAVE_CORREO_RECORDADO);
        }
      } catch {
        // El almacenamiento local puede no estar disponible.
      }

      setAnuncioLive("Inicio de sesión exitoso. Redirigiendo...");

      const prefiereMenosMovimiento = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;
      const retraso = prefiereMenosMovimiento ? 0 : 450;

      temporizadorRedireccion.current = window.setTimeout(() => {
        navigate(destino, { replace: true });
      }, retraso);
    } catch (err) {
      let mensajeError = "Ocurrió un error al iniciar sesión.";

      if (err.status === 429) {
        mensajeError = "Demasiados intentos. Espera un minuto.";
      } else if (err.status === 401) {
        mensajeError = err.message || "Credenciales incorrectas.";
      } else if (err.status === 0) {
        mensajeError = err.message || "No se pudo conectar con el servidor.";
      } else if (err.message) {
        mensajeError = err.message;
      }

      setErrorServidor(mensajeError);
      setAnuncioLive(`Error al iniciar sesión: ${mensajeError}`);
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-dvh w-full bg-slate-50 transition-colors duration-300 lg:h-dvh lg:overflow-hidden dark:bg-[#0B1220]">
      <div
        className="sr-only"
        aria-live="polite"
        aria-atomic="true"
      >
        {anuncioLive}
      </div>

      <div className="flex min-h-dvh w-full flex-col lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[66%_34%]">
        <PanelInstitucional
          diapositivaActiva={diapositivaActiva}
          onSeleccionarDiapositiva={seleccionarDiapositiva}
        />

        <main className="flex min-h-0 w-full items-center justify-center bg-slate-50 px-5 py-6 transition-colors duration-300 sm:px-8 lg:h-full lg:px-10 lg:py-6 dark:bg-[#0B1220]">
          <div className="relative w-full max-w-[420px] pt-24">
            <div className="absolute right-6 top-6">
              <InterruptorTema />
            </div>

            <h1 className="text-[clamp(1.875rem,4vw,2.75rem)] font-extrabold leading-[1.1] tracking-[-0.02em] text-slate-900 transition-colors duration-300 dark:text-slate-50">
              Bienvenido a{" "}
              <span className="text-upla-600 dark:text-[#7FD0FF]">
                ReservaUPLA
              </span>
            </h1>
            <div
              aria-hidden="true"
              className="mt-3 h-1 w-12 rounded-full bg-upla-500"
            />
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-slate-600 transition-colors duration-300 dark:text-slate-300">
              Gestiona inteligentemente los ambientes institucionales de
              nuestra universidad
            </p>

            <p className="mt-4 text-xs text-slate-500 transition-colors duration-300 dark:text-slate-400">
              <span
                className="text-red-600 transition-colors duration-300 dark:text-red-400"
                aria-hidden="true"
              >
                *
              </span>{" "}
              Campo obligatorio
            </p>

            {errorServidor && (
              <div className="mt-4">
                <AlertMessage type="error" title="Error de autenticación">
                  {errorServidor}
                </AlertMessage>
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
              <TextInput
                label="Correo institucional"
                name="correo"
                type="email"
                value={correo}
                onFocus={handleCorreoFocus}
                onBlur={handleCorreoBlur}
                onChange={handleCorreoChange}
                placeholder="nombre@upla.edu.pe"
                autoComplete="username"
                required
                error={mostrarErrorCorreo}
                leadingIcon={<IconoSobre />}
                inputClassName="min-h-[48px] h-12 !rounded-[10px] text-base"
              />

              <PasswordInput
                label="Contraseña"
                name="contrasena"
                value={contrasena}
                onFocus={handleContrasenaFocus}
                onBlur={handleContrasenaBlur}
                onChange={handleContrasenaChange}
                autoComplete="current-password"
                required
                error={mostrarErrorContrasena}
                leadingIcon={<IconoCandado />}
                inputClassName="min-h-[48px] h-12 !rounded-[10px] text-base"
              />

              <div className="flex items-center justify-between gap-3 pt-1">
                <label
                  htmlFor="recordar-correo"
                  className="inline-flex min-h-[32px] cursor-pointer items-center gap-2 py-1 text-sm text-slate-700 transition-colors duration-300 dark:text-slate-200"
                >
                  <input
                    id="recordar-correo"
                    name="recordar-correo"
                    type="checkbox"
                    checked={recordarCorreo}
                    onChange={handleRecordarCorreo}
                    className="h-6 w-6 rounded border-campo accent-upla-600 transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-upla-600 dark:border-slate-500 dark:focus-visible:outline-[#7FD0FF]"
                  />
                  Recordar mi correo
                </label>
              </div>

              <Button
                type="submit"
                variant="login"
                loading={enviando}
                loadingLabel="Iniciando sesión…"
                className="group w-full h-[52px] rounded-xl text-base font-semibold"
              >
                Iniciar sesión
                <IconoFlecha />
              </Button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={() =>
                    setMostrarAyudaContrasena((valor) => !valor)
                  }
                  aria-expanded={mostrarAyudaContrasena}
                  aria-controls="ayuda-contrasena"
                  className="inline-flex min-h-[32px] items-center rounded text-sm font-medium text-upla-600 underline-offset-4 transition-colors duration-300 hover:text-upla-700 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-upla-600 dark:text-[#7FD0FF] dark:hover:text-[#A9DEFF] dark:focus-visible:outline-[#7FD0FF]"
                >
                  ¿Olvidaste tu contraseña?
                </button>

                {mostrarAyudaContrasena && (
                  <div id="ayuda-contrasena" className="mt-3 text-left">
                    <AlertMessage type="info">
                      Para restablecer tu contraseña, comunícate con el
                      administrador de ReservaUPLA.
                    </AlertMessage>
                  </div>
                )}
              </div>
            </form>
          </div>
        </main>
      </div>
    </div>
  );
}
