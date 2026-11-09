using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Interfaces;

public interface IReservaRepository
{
    void Add(Reserva reserva);
    bool ExisteSolapamientoAprobado(Guid ambienteId, DateOnly fecha, TimeOnly horaInicio, TimeOnly horaFin);
    bool ExisteSolapamientoAprobadoExcluyendo(Guid ambienteId, DateOnly fecha, TimeOnly horaInicio, TimeOnly horaFin, Guid reservaIdExcluir);
    IEnumerable<ReservaListadoDto> Listar(FiltroReservaDto? filtro, UsuarioSesionDto sesion);
    Reserva? ObtenerPorIdConRelaciones(Guid id);
    void Actualizar(Reserva reserva);
    DashboardDto ObtenerDashboard(UsuarioSesionDto sesion);
}
