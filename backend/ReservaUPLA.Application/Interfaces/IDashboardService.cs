using ReservaUPLA.Application.DTOs;

namespace ReservaUPLA.Application.Interfaces;

public interface IDashboardService
{
    DashboardDto ObtenerDashboard(UsuarioSesionDto sesion);
}
