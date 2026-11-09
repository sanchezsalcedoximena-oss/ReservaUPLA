export default function EncabezadoPagina({
  titulo,
  descripcion,
  children,
  className = "",
}) {
  return (
    <div
      className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}
    >
      <div>
        <h1 className="text-2xl font-bold text-slate-900">{titulo}</h1>
        {descripcion && (
          <p className="mt-1 text-sm text-slate-600">{descripcion}</p>
        )}
      </div>
      {children}
    </div>
  );
}
