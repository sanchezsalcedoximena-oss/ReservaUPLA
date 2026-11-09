import { Link } from "react-router-dom";

export default function CardIndicador({
  titulo,
  valor,
  descripcion,
  tono = "neutral",
  to,
  className = "",
}) {
  const toneClasses =
    {
      neutral: "border-l-slate-400",
      warning: "border-l-amber-500",
      success: "border-l-emerald-600",
      danger: "border-l-red-600",
    }[tono] || "border-l-slate-400";

  const baseClasses = `block h-full border-l-4 bg-white p-5 rounded-r-lg border-y border-r border-slate-200 shadow-sm ${toneClasses} ${className}`;

  const content = (
    <>
      <h3 className="text-sm font-medium text-slate-600 truncate">
        {titulo}
      </h3>
      <p className="mt-2 text-3xl font-bold tracking-tight text-slate-900 break-words">
        {valor}
      </p>
      {descripcion && (
        <p className="mt-1 text-xs text-slate-500">
          {descripcion}
        </p>
      )}
    </>
  );

  if (to) {
    return (
      <Link
        to={to}
        className={`${baseClasses} transition-shadow hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-upla-500`}
      >
        {content}
      </Link>
    );
  }

  return <div className={baseClasses}>{content}</div>;
}
