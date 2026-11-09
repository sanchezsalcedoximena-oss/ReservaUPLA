import "./LogoUPLA.css";
import logoColor from "../../logo/logo.webp";
import logoBlanco from "../../logo/logo-blanco.webp";

export default function LogoUPLA({
  width = "180px",
  animado = true,
  variante = "color",
  className = "",
}) {
  const widthStyle = typeof width === "number" ? `${width}px` : width;
  const esBlanco = variante === "blanco";
  const animClass = animado ? "" : "logo-link--no-initial";

  return (
    <a
      href="https://upla.edu.pe/"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Universidad Peruana Los Andes: abrir el sitio oficial en una pestaña nueva"
      className={`logo-link ${
        esBlanco ? "logo-link--blanco" : "logo-link--color"
      } ${animClass} ${className}`}
    >
      <img
        src={esBlanco ? logoBlanco : logoColor}
        alt=""
        width={480}
        height={176}
        style={{ width: widthStyle }}
        className="h-auto object-contain max-w-full"
      />
    </a>
  );
}
