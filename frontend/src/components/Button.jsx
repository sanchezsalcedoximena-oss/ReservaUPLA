import Spinner from "./Spinner.jsx";

export default function Button({
  children,
  variant = "primary",
  type = "button",
  loading = false,
  loadingLabel = "Cargando…",
  disabled = false,
  onClick,
  className = "",
  ref,
  ...rest
}) {
  const variantClasses =
    {
      primary:
        "bg-upla-500 text-white hover:bg-upla-600 active:bg-upla-700 focus-visible:outline-upla-500",
      login:
        "boton-marca bg-gradient-to-b from-upla-500 to-upla-700 text-white tracking-wide shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_10px_20px_-6px_rgba(0,88,155,0.45)] hover:-translate-y-px hover:from-[#0073c7] hover:to-upla-600 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_16px_28px_-8px_rgba(0,88,155,0.55)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-700 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-50 motion-reduce:hover:translate-y-0 motion-reduce:active:scale-100 dark:focus-visible:ring-[#7FD0FF] dark:focus-visible:ring-offset-[#0B1220]",
      secondary:
        "bg-white text-slate-800 border border-campo hover:border-slate-500 hover:bg-slate-50 active:bg-slate-100 focus-visible:outline-upla-500",
      danger:
        "bg-red-600 text-white hover:bg-red-700 active:bg-red-800 focus-visible:outline-red-600",
      ghost:
        "bg-transparent text-slate-700 hover:bg-slate-100 active:bg-slate-200 focus-visible:outline-upla-500",
    }[variant] || "";

  const handleClick = (e) => {
    if (disabled || loading) {
      e.preventDefault();
      return;
    }
    onClick?.(e);
  };

  return (
    <button
      ref={ref}
      type={type}
      disabled={disabled || loading}
      aria-busy={loading ? "true" : undefined}
      onClick={handleClick}
      className={`relative inline-flex items-center justify-center min-h-[44px] px-4 py-2 text-sm font-medium rounded-md transition duration-200 disabled:opacity-60 disabled:cursor-not-allowed focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${variantClasses} ${className}`}
      {...rest}
    >
      <span className={loading ? "invisible" : "inline-flex items-center gap-2"}>
        {children}
      </span>
      {loading && (
        <span className="absolute inset-0 flex items-center justify-center gap-2">
          <Spinner size="sm" />
          <span>{loadingLabel}</span>
        </span>
      )}
    </button>
  );
}
