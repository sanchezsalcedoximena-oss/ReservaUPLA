import { Component } from "react";
import Button from "./Button.jsx";
import PaginaEstado from "./PaginaEstado.jsx";

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hayError: false };
  }

  static getDerivedStateFromError() {
    return { hayError: true };
  }

  componentDidCatch(error, info) {
    console.error("Error no controlado en la interfaz.", error, info);
  }

  render() {
    if (this.state.hayError) {
      return (
        <div role="alert">
          <PaginaEstado
            compacto
            titulo="Algo salió mal"
            descripcion="Ocurrió un error inesperado al mostrar esta página. Recarga para volver a intentarlo."
          >
            <Button onClick={() => window.location.reload()}>Recargar</Button>
          </PaginaEstado>
        </div>
      );
    }

    return this.props.children;
  }
}
