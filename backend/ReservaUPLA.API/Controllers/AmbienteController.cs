using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.API.Responses;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Constants;

namespace ReservaUPLA.API.Controllers;

[Authorize]
[ApiController]
[Route("api/ambiente")]
public class AmbienteController : ControllerBase
{
    private readonly IAmbienteService _ambienteService;

    public AmbienteController(IAmbienteService ambienteService)
    {
        _ambienteService = ambienteService;
    }

    [Authorize(Roles = RolUsuario.Administrador)]
    [HttpPost]
    public ActionResult<ApiResponse<AmbienteDto>> Crear([FromBody] CreateAmbienteDto dto)
    {
        var creado = _ambienteService.Crear(dto);
        return CreatedAtAction(nameof(Listar), new { id = creado.Id }, ApiResponse<AmbienteDto>.Exito(creado, "Ambiente registrado exitosamente."));
    }

    [HttpGet]
    public ActionResult<ApiResponse<IEnumerable<AmbienteDto>>> Listar([FromQuery] bool soloDisponibles = false)
    {
        var ambientes = _ambienteService.Listar(soloDisponibles);
        return Ok(ApiResponse<IEnumerable<AmbienteDto>>.Exito(ambientes, "Ambientes obtenidos exitosamente."));
    }
}
