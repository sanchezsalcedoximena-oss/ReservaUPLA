import PaginaEstado from "../components/PaginaEstado.jsx";
import BotonEnlace from "../components/BotonEnlace.jsx";

export default function NoEncontradaPage() {
  return (
    <PaginaEstado
      codigo="404"
      titulo="Página no encontrada"
      descripcion="La ruta solicitada no existe o ha sido movida."
    >
      <BotonEnlace to="/">Volver al inicio</BotonEnlace>
    </PaginaEstado>
  );
}
