using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.API.Extensions;
using ReservaUPLA.API.Responses;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.API.Controllers;

[Authorize]
[ApiController]
[Route("api/dashboard")]
public class DashboardController : ControllerBase
{
    private readonly IDashboardService _dashboardService;

    public DashboardController(IDashboardService dashboardService)
    {
        _dashboardService = dashboardService;
    }

    [HttpGet]
    public ActionResult<ApiResponse<DashboardDto>> ObtenerDashboard()
    {
        var sesion = User.ObtenerSesion();
        var dashboard = _dashboardService.ObtenerDashboard(sesion);
        return Ok(ApiResponse<DashboardDto>.Exito(dashboard, "Indicadores del dashboard obtenidos exitosamente."));
    }
}
