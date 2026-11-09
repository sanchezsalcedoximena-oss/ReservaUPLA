using ReservaUPLA.Application.DTOs;

namespace ReservaUPLA.Application.Interfaces;

public interface IReservaService
{
    ReservaDto Crear(CreateReservaDto dto, UsuarioSesionDto sesion);
    IEnumerable<ReservaListadoDto> Listar(FiltroReservaDto? filtro, UsuarioSesionDto sesion);
    ReservaDetalleDto ObtenerDetalle(Guid id, UsuarioSesionDto sesion);
    ReservaDetalleDto CambiarEstado(Guid id, CambiarEstadoReservaDto dto, UsuarioSesionDto sesion);
}
