export function EtiquetaCampo({ htmlFor, label, required = false }) {
  if (!label) {
    return null;
  }

  return (
    <label
      htmlFor={htmlFor}
      className="mb-1 block text-sm font-medium text-slate-700 transition-colors duration-300 dark:text-slate-200"
    >
      {label}
      {required && (
        <>
          <span
            className="ml-1 text-red-600 transition-colors duration-300 dark:text-red-400"
            aria-hidden="true"
          >
            *
          </span>
          <span className="sr-only"> obligatorio</span>
        </>
      )}
    </label>
  );
}

export function MensajesCampo({ hintId, hint, errorId, error }) {
  return (
    <>
      {hint && (
        <p
          id={hintId}
          className="mt-1 text-xs text-slate-500 transition-colors duration-300 dark:text-slate-400"
        >
          {hint}
        </p>
      )}

      {error && (
        <p
          id={errorId}
          className="mt-1 text-sm font-medium text-red-600 transition-colors duration-300 dark:text-red-400"
        >
          {error}
        </p>
      )}
    </>
  );
}
