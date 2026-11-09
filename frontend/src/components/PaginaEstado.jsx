export default function PaginaEstado({
  codigo,
  titulo,
  descripcion,
  children,
  compacto = false,
}) {
  return (
    <div
      className={
        compacto
          ? "flex items-center justify-center py-10"
          : "flex min-h-dvh items-center justify-center bg-slate-50 p-4"
      }
    >
      <div className="w-full max-w-md rounded-lg border border-slate-200 bg-white p-8 text-center shadow-sm">
        {codigo && (
          <p className="text-sm font-semibold tracking-[0.2em] text-upla-600">
            {codigo}
          </p>
        )}
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{titulo}</h1>
        <p className="mt-3 text-sm leading-relaxed text-slate-600">
          {descripcion}
        </p>
        {children && (
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {children}
          </div>
        )}
      </div>
    </div>
  );
}
