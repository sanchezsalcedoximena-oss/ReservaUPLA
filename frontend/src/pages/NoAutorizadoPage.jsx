import PaginaEstado from "../components/PaginaEstado.jsx";
import BotonEnlace from "../components/BotonEnlace.jsx";

export default function NoAutorizadoPage({ rol }) {
  return (
    <PaginaEstado
      codigo="403"
      titulo="No tienes permiso"
      descripcion={
        rol
          ? `Tu rol actual (${rol}) no tiene autorización para acceder a este recurso.`
          : "Tu rol actual no tiene autorización para acceder a este recurso."
      }
    >
      <BotonEnlace to="/">Volver al inicio</BotonEnlace>
    </PaginaEstado>
  );
}
