export default function EstadoBadge({ estado, className = "" }) {
  const configs = {
    Pendiente: {
      label: "Pendiente",
      classes: "bg-amber-100 text-amber-950 border-amber-300",
      icon: (
        <svg
          className="w-3.5 h-3.5 shrink-0 text-amber-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    Aprobada: {
      label: "Aprobada",
      classes: "bg-emerald-100 text-emerald-950 border-emerald-300",
      icon: (
        <svg
          className="w-3.5 h-3.5 shrink-0 text-emerald-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    Rechazada: {
      label: "Rechazada",
      classes: "bg-red-100 text-red-950 border-red-300",
      icon: (
        <svg
          className="w-3.5 h-3.5 shrink-0 text-red-800"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
    Cancelada: {
      label: "Cancelada",
      classes: "bg-slate-200 text-slate-900 border-slate-300",
      icon: (
        <svg
          className="w-3.5 h-3.5 shrink-0 text-slate-700"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M15 12H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
    },
  };

  const actual = configs[estado] || {
    label: estado || "Desconocido",
    classes: "bg-slate-100 text-slate-800 border-slate-200",
    icon: null,
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${actual.classes} ${className}`}
    >
      {actual.icon}
      <span>{actual.label}</span>
    </span>
  );
}
