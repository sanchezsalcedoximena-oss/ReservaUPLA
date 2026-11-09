import { Link } from "react-router-dom";

const VARIANTES = {
  primary:
    "bg-upla-500 text-white shadow-sm hover:bg-upla-600 focus-visible:outline-upla-500",
  secondary:
    "bg-white text-slate-800 border border-campo hover:border-slate-500 hover:bg-slate-50 focus-visible:outline-upla-500",
};

export default function BotonEnlace({
  to,
  variant = "primary",
  className = "",
  children,
  ...rest
}) {
  return (
    <Link
      to={to}
      className={`inline-flex min-h-[44px] items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 ${VARIANTES[variant] || VARIANTES.primary} ${className}`}
      {...rest}
    >
      {children}
    </Link>
  );
}
