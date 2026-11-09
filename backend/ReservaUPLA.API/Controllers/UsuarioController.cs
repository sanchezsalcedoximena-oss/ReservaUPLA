using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using ReservaUPLA.API.Responses;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Constants;

namespace ReservaUPLA.API.Controllers;

[Authorize(Roles = RolUsuario.Administrador)]
[ApiController]
[Route("api/usuario")]
public class UsuarioController : ControllerBase
{
    private readonly IUsuarioService _usuarioService;

    public UsuarioController(IUsuarioService usuarioService)
    {
        _usuarioService = usuarioService;
    }

    [HttpPost]
    public ActionResult<ApiResponse<UsuarioDto>> Crear([FromBody] CreateUsuarioDto dto)
    {
        var creado = _usuarioService.Crear(dto);
        return CreatedAtAction(nameof(Listar), new { id = creado.Id }, ApiResponse<UsuarioDto>.Exito(creado, "Usuario registrado exitosamente."));
    }

    [HttpGet]
    public ActionResult<ApiResponse<IEnumerable<UsuarioDto>>> Listar([FromQuery] string? rol = null)
    {
        var usuarios = _usuarioService.Listar(rol);
        return Ok(ApiResponse<IEnumerable<UsuarioDto>>.Exito(usuarios, "Usuarios obtenidos exitosamente."));
    }
}
