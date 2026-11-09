import { useEffect, useMemo, useState } from "react";
import Particles, { initParticlesEngine } from "@tsparticles/react";
import { loadSlim } from "@tsparticles/slim";
import { crearOpcionesParticulas } from "./particulasConfig.js";

let motorParticles = null;

function inicializarMotor() {
  if (!motorParticles) {
    motorParticles = initParticlesEngine(async (engine) => {
      await loadSlim(engine);
    });
  }

  return motorParticles;
}

function obtenerCantidadParticulas() {
  if (typeof window === "undefined") {
    return 55;
  }

  return window.innerWidth < 1280 ? 30 : 55;
}

export default function ParticulasLuminosas() {
  const [motorListo, setMotorListo] = useState(false);
  const [cantidad, setCantidad] = useState(obtenerCantidadParticulas);
  const [pestanaVisible, setPestanaVisible] = useState(() => {
    if (typeof document === "undefined") {
      return true;
    }

    return document.visibilityState !== "hidden";
  });

  useEffect(() => {
    let activo = true;

    inicializarMotor()
      .then(() => {
        if (activo) {
          setMotorListo(true);
        }
      })
      .catch(() => {
        if (activo) {
          setMotorListo(false);
        }
      });

    return () => {
      activo = false;
    };
  }, []);

  useEffect(() => {
    const actualizarCantidad = () => setCantidad(obtenerCantidadParticulas());
    const actualizarVisibilidad = () =>
      setPestanaVisible(document.visibilityState !== "hidden");

    window.addEventListener("resize", actualizarCantidad);
    document.addEventListener("visibilitychange", actualizarVisibilidad);

    return () => {
      window.removeEventListener("resize", actualizarCantidad);
      document.removeEventListener("visibilitychange", actualizarVisibilidad);
    };
  }, []);

  const opciones = useMemo(() => crearOpcionesParticulas(cantidad), [cantidad]);

  if (!motorListo || !pestanaVisible) {
    return null;
  }

  return (
    <div
      className="pointer-events-none absolute inset-0 z-30"
      aria-hidden="true"
    >
      <Particles
        id="particulas-login"
        options={opciones}
        className="h-full w-full"
      />
    </div>
  );
}
