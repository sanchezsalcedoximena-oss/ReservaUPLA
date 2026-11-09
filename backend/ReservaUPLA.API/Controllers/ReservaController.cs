using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.API.Extensions;
using ReservaUPLA.API.Responses;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Constants;

namespace ReservaUPLA.API.Controllers;

[Authorize]
[ApiController]
[Route("api/reserva")]
public class ReservaController : ControllerBase
{
    private readonly IReservaService _reservaService;

    public ReservaController(IReservaService reservaService)
    {
        _reservaService = reservaService;
    }

    [Authorize(Roles = RolUsuario.SolicitanteOAdministrador)]
    [HttpPost]
    public ActionResult<ApiResponse<ReservaDto>> Crear([FromBody] CreateReservaDto dto)
    {
        var sesion = User.ObtenerSesion();
        var creada = _reservaService.Crear(dto, sesion);
        return StatusCode(StatusCodes.Status201Created, ApiResponse<ReservaDto>.Exito(creada, "Reserva registrada exitosamente."));
    }

    [HttpGet]
    public ActionResult<ApiResponse<IEnumerable<ReservaListadoDto>>> Listar([FromQuery] FiltroReservaDto filtro)
    {
        var sesion = User.ObtenerSesion();
        var reservas = _reservaService.Listar(filtro, sesion);
        return Ok(ApiResponse<IEnumerable<ReservaListadoDto>>.Exito(reservas, "Reservas obtenidas exitosamente."));
    }

    [HttpGet("{id:guid}")]
    public ActionResult<ApiResponse<ReservaDetalleDto>> ObtenerDetalle(Guid id)
    {
        var sesion = User.ObtenerSesion();
        var detalle = _reservaService.ObtenerDetalle(id, sesion);
        return Ok(ApiResponse<ReservaDetalleDto>.Exito(detalle, "Detalle de reserva obtenido exitosamente."));
    }

    [HttpPatch("{id:guid}/estado")]
    public ActionResult<ApiResponse<ReservaDetalleDto>> CambiarEstado(Guid id, [FromBody] CambiarEstadoReservaDto dto)
    {
        var sesion = User.ObtenerSesion();
        var actualizado = _reservaService.CambiarEstado(id, dto, sesion);
        return Ok(ApiResponse<ReservaDetalleDto>.Exito(actualizado, "Estado de reserva actualizado exitosamente."));
    }
}
