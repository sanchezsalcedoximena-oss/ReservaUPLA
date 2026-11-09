using System.Security.Claims;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using ReservaUPLA.API.Extensions;
using ReservaUPLA.API.Responses;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.API.Controllers;

[ApiController]
[Route("api/auth")]
public class AuthController : ControllerBase
{
    private readonly IAutenticacionService _autenticacionService;

    public AuthController(IAutenticacionService autenticacionService)
    {
        _autenticacionService = autenticacionService;
    }

    [HttpPost("login")]
    [EnableRateLimiting("login")]
    public async Task<ActionResult<ApiResponse<UsuarioSesionDto>>> Login([FromBody] LoginDto dto)
    {
        var sesion = _autenticacionService.Autenticar(dto);

        var claims = new List<Claim>
        {
            new(ClaimTypes.NameIdentifier, sesion.Id.ToString()),
            new(ClaimTypes.Name, sesion.NombreCompleto),
            new(ClaimTypes.Email, sesion.Correo),
            new(ClaimTypes.Role, sesion.Rol)
        };

        var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
        var principal = new ClaimsPrincipal(identity);

        var authProperties = new AuthenticationProperties
        {
            IsPersistent = true,
            ExpiresUtc = DateTimeOffset.UtcNow.AddHours(8)
        };

        await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, authProperties);

        return Ok(ApiResponse<UsuarioSesionDto>.Exito(sesion, "Inicio de sesión exitoso."));
    }

    [Authorize]
    [HttpPost("logout")]
    public async Task<ActionResult<ApiResponse<object>>> Logout()
    {
        await HttpContext.SignOutAsync(CookieAuthenticationDefaults.AuthenticationScheme);
        return Ok(ApiResponse<object>.Exito(null, "Sesión cerrada exitosamente."));
    }

    [Authorize]
    [HttpGet("me")]
    public ActionResult<ApiResponse<UsuarioSesionDto>> Me()
    {
        var sesion = User.ObtenerSesion();
        var sesionActualizada = _autenticacionService.ObtenerSesion(sesion.Id);
        return Ok(ApiResponse<UsuarioSesionDto>.Exito(sesionActualizada, "Sesión obtenida exitosamente."));
    }
}
