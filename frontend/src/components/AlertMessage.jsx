export default function AlertMessage({
  type = "info",
  title,
  message,
  children,
  onClose,
  className = "",
}) {
  const content = message ?? children;
  if (!content && !title) return null;

  const isAlert = type === "error" || type === "warning";
  const role = isAlert ? "alert" : "status";

  const config =
    {
      success: {
        container:
          "bg-emerald-50 border-emerald-300 text-emerald-950 dark:bg-emerald-950/40 dark:border-emerald-800 dark:text-emerald-100",
        iconColor: "text-emerald-700 dark:text-emerald-400",
        icon: (
          <svg
            className="w-5 h-5"
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
        typeLabel: "Éxito:",
      },
      error: {
        container:
          "bg-red-50 border-red-300 text-red-950 dark:bg-red-950/40 dark:border-red-800 dark:text-red-100",
        iconColor: "text-red-700 dark:text-red-400",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        typeLabel: "Error:",
      },
      warning: {
        container:
          "bg-amber-50 border-amber-300 text-amber-950 dark:bg-amber-950/40 dark:border-amber-800 dark:text-amber-100",
        iconColor: "text-amber-700 dark:text-amber-400",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        ),
        typeLabel: "Advertencia:",
      },
      info: {
        container:
          "bg-upla-50 border-upla-300 text-upla-950 dark:bg-upla-900/50 dark:border-upla-700 dark:text-upla-50",
        iconColor: "text-upla-700 dark:text-[#7FD0FF]",
        icon: (
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        ),
        typeLabel: "Información:",
      },
    }[type] || {
      container:
        "bg-slate-50 border-slate-300 text-slate-900 dark:bg-slate-800/60 dark:border-slate-600 dark:text-slate-100",
      iconColor: "text-slate-700 dark:text-slate-300",
      icon: null,
      typeLabel: "Nota:",
    };

  return (
    <div
      role={role}
      className={`border rounded-md p-4 transition-colors duration-300 ${config.container} ${className}`}
    >
      <div className="flex items-start gap-3">
        {config.icon && (
          <span className={`shrink-0 mt-0.5 ${config.iconColor}`}>
            {config.icon}
          </span>
        )}
        <div className="flex-1 text-sm">
          <span className="sr-only">{config.typeLabel} </span>
          {title && (
            <p className="mb-1 font-semibold text-inherit">{title}</p>
          )}
          {content && <div className="leading-relaxed">{content}</div>}
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar mensaje"
            className="shrink-0 -mr-1 -mt-1 p-1 rounded hover:bg-black/5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-upla-500"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        )}
      </div>
    </div>
  );
}
