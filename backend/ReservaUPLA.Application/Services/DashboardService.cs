using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.Application.Services;

public class DashboardService : IDashboardService
{
    private readonly IReservaRepository _reservaRepository;

    public DashboardService(IReservaRepository reservaRepository)
    {
        _reservaRepository = reservaRepository;
    }

    public DashboardDto ObtenerDashboard(UsuarioSesionDto sesion)
    {
        return _reservaRepository.ObtenerDashboard(sesion);
    }
}
