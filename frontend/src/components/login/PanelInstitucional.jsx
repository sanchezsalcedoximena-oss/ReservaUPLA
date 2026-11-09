import { useEffect, useState } from "react";
import LogoUPLA from "../LogoUPLA.jsx";
import ParticulasLuminosas from "./ParticulasLuminosas.jsx";
import img1 from "../../../img_login/img1.webp";
import img2 from "../../../img_login/img2.webp";
import img3 from "../../../img_login/img3.webp";

const DIAPOSITIVAS = [
  {
    imagen: img1,
    ancho: 1532,
    alto: 1027,
    titulo: "Bienvenido a la comunidad UPLA",
    descripcion:
      "Un campus pensado para tu desarrollo académico y profesional.",
  },
  {
    imagen: img2,
    ancho: 1539,
    alto: 1022,
    titulo: "Una comunidad que aprende junta",
    descripcion:
      "Aulas, laboratorios y espacios compartidos para estudiar, investigar y colaborar.",
  },
  {
    imagen: img3,
    ancho: 1539,
    alto: 1022,
    titulo: "Reserva con seguridad y orden",
    descripcion:
      "Gestiona laboratorios, auditorios y salas con disponibilidad real y trazabilidad.",
  },
];

function useMediaQuery(query) {
  const [coincide, setCoincide] = useState(() => {
    if (typeof window === "undefined") {
      return false;
    }

    return window.matchMedia(query).matches;
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const mediaQuery = window.matchMedia(query);
    const actualizar = (evento) => setCoincide(evento.matches);

    mediaQuery.addEventListener("change", actualizar);

    return () => mediaQuery.removeEventListener("change", actualizar);
  }, [query]);

  return coincide;
}

function OndasDecorativas({ className = "" }) {
  return (
    <svg
      viewBox="0 0 1200 260"
      preserveAspectRatio="none"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M0 134c142-66 264 32 406 8 142-24 254-92 396-66 142 26 258 82 398 54v130H0Z"
        fill="#0065B1"
        opacity="0.16"
      />
      <path
        d="M0 178c156-54 276 18 418 2 142-16 246-64 388-42 142 22 260 62 394 38v84H0Z"
        fill="#4D93C8"
        opacity="0.14"
      />
      <path
        d="M0 212c168-34 288 12 430 4 142-8 250-38 392-24 142 14 262 36 378 18v50H0Z"
        fill="#A0C6E2"
        opacity="0.1"
      />
    </svg>
  );
}

export default function PanelInstitucional({
  diapositivaActiva = 0,
  onSeleccionarDiapositiva,
}) {
  const esEscritorio = useMediaQuery("(min-width: 1024px)");
  const prefiereMenosMovimiento = useMediaQuery(
    "(prefers-reduced-motion: reduce)"
  );

  const diapositiva = DIAPOSITIVAS[diapositivaActiva] ?? DIAPOSITIVAS[0];

  if (!esEscritorio) {
    return (
      <section
        aria-label="Presentación institucional"
        className="relative h-[200px] w-full overflow-hidden bg-upla-900 lg:hidden"
      >
        <img
          src={DIAPOSITIVAS[0].imagen}
          alt=""
          width={DIAPOSITIVAS[0].ancho}
          height={DIAPOSITIVAS[0].alto}
          className="absolute inset-0 h-full w-full object-cover"
          loading="eager"
          decoding="async"
          fetchPriority="high"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-upla-900 via-upla-900/80 to-upla-900/30"
          aria-hidden="true"
        />
        <div
          className="absolute inset-x-0 top-0 h-28 bg-gradient-to-b from-upla-900/60 to-transparent"
          aria-hidden="true"
        />
        <OndasDecorativas className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 w-full" />
        <div className="relative z-20 flex h-full flex-col justify-between p-5">
          <div className="w-fit">
            <LogoUPLA variante="blanco" width="132px" />
          </div>
          <p className="text-sm font-semibold text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.5)]">
            Aprende, crece y construye tu futuro
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      role="region"
      aria-roledescription="carrusel"
      aria-label="Presentación institucional"
      className="relative hidden h-full w-full overflow-hidden bg-upla-900 lg:block"
    >
      <div className="absolute inset-0" aria-hidden="true">
        {DIAPOSITIVAS.map((item, indice) => {
          const activa = indice === diapositivaActiva;

          return (
            <div
              key={item.titulo}
              className={`absolute inset-0 transition-opacity duration-500 ease-in-out motion-reduce:transition-none ${
                activa ? "opacity-100" : "opacity-0"
              }`}
              aria-hidden={!activa}
              inert={!activa}
            >
              <img
                src={item.imagen}
                alt=""
                width={item.ancho}
                height={item.alto}
                className="h-full w-full object-cover"
                loading={indice === 0 ? "eager" : "lazy"}
                decoding="async"
                fetchPriority={indice === 0 ? "high" : "auto"}
              />
            </div>
          );
        })}
      </div>

      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-upla-900 via-upla-900/85 to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-48 bg-gradient-to-b from-upla-900/60 to-transparent"
        aria-hidden="true"
      />

      <OndasDecorativas className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-40 w-full" />

      {!prefiereMenosMovimiento && <ParticulasLuminosas />}

      <div className="absolute left-6 top-6 z-40 lg:left-8 lg:top-8">
        <LogoUPLA variante="blanco" width="180px" />
      </div>

      <div className="absolute inset-x-0 bottom-0 z-40 p-8 lg:p-10">
        <div className="max-w-lg">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-upla-100">
            Aprende, crece y construye tu futuro
          </p>
          <p className="text-3xl font-bold leading-tight text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] lg:text-4xl">
            {diapositiva.titulo}
          </p>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-upla-50 drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)] lg:text-base">
            {diapositiva.descripcion}
          </p>

          <div
            className="mt-6 flex items-center gap-1"
            role="group"
            aria-label="Seleccionar imagen"
          >
            {DIAPOSITIVAS.map((item, indice) => {
              const activa = indice === diapositivaActiva;

              return (
                <button
                  key={item.titulo}
                  type="button"
                  onClick={() => onSeleccionarDiapositiva?.(indice)}
                  aria-label={`Mostrar imagen ${indice + 1} de 3: ${item.titulo}`}
                  aria-current={activa ? "true" : undefined}
                  className="flex h-6 w-6 items-center justify-center rounded-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span
                    className={`block rounded-full transition-all duration-300 motion-reduce:transition-none ${
                      activa
                        ? "h-2.5 w-6 bg-white"
                        : "h-2.5 w-2.5 bg-white/50"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
