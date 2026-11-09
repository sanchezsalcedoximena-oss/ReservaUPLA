import { useTema } from "../context/useTema.js";

function IconoSol({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      className={className}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconoLuna({ className = "" }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
    >
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z" />
    </svg>
  );
}

export default function InterruptorTema({ className = "" }) {
  const { esOscuro, alternarTema } = useTema();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={esOscuro}
      aria-label="Modo oscuro"
      onClick={alternarTema}
      className={`relative inline-flex h-11 w-32 shrink-0 items-center rounded-full border transition-colors duration-300 ease-in-out focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-upla-600 motion-reduce:transition-none dark:border-slate-400 dark:focus-visible:outline-[#7FD0FF] ${
        esOscuro
          ? "border-slate-400 bg-slate-700/70"
          : "border-campo bg-slate-200/90"
      } ${className}`}
    >
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 left-4 flex items-center text-xs font-semibold tracking-wide text-slate-50 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
          esOscuro ? "opacity-100" : "opacity-0"
        }`}
      >
        Oscuro
      </span>

      <span
        aria-hidden="true"
        className={`pointer-events-none absolute inset-y-0 right-4 flex items-center text-xs font-semibold tracking-wide text-slate-700 transition-opacity duration-300 ease-in-out motion-reduce:transition-none ${
          esOscuro ? "opacity-0" : "opacity-100"
        }`}
      >
        Claro
      </span>

      <span
        aria-hidden="true"
        className={`absolute top-1/2 flex h-14 w-16 -translate-y-1/2 items-center justify-center rounded-full border border-white/35 bg-gradient-to-br backdrop-blur-md backdrop-saturate-150 transition-transform duration-300 ease-in-out motion-reduce:transition-none ${
          esOscuro
            ? "translate-x-16 from-white/25 to-white/10 shadow-[inset_0_1px_1px_rgba(255,255,255,0.45),inset_0_-2px_6px_rgba(0,43,78,0.25),0_8px_18px_rgba(0,0,0,0.35)]"
            : "translate-x-0 from-white/75 to-white/35 shadow-[inset_0_1px_1px_rgba(255,255,255,0.7),inset_0_-2px_6px_rgba(0,43,78,0.12),0_8px_18px_rgba(0,43,78,0.28)]"
        }`}
      >
        <span className="relative block h-6 w-6">
          <IconoSol
            className={`absolute inset-0 h-6 w-6 text-amber-500 transition-all duration-300 ease-in-out motion-reduce:transition-none ${
              esOscuro
                ? "rotate-90 scale-50 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          />
          <IconoLuna
            className={`absolute inset-0 h-6 w-6 text-upla-100 drop-shadow-[0_0_6px_rgba(127,208,255,0.85)] transition-all duration-300 ease-in-out motion-reduce:transition-none ${
              esOscuro
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-50 opacity-0"
            }`}
          />
        </span>
      </span>
    </button>
  );
}
