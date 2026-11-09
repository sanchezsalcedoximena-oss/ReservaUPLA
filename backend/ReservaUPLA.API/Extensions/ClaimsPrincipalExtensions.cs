using System.Security.Claims;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Exceptions;

namespace ReservaUPLA.API.Extensions;

public static class ClaimsPrincipalExtensions
{
    public static UsuarioSesionDto ObtenerSesion(this ClaimsPrincipal principal)
    {
        var idStr = principal.FindFirstValue(ClaimTypes.NameIdentifier);
        if (string.IsNullOrWhiteSpace(idStr) || !Guid.TryParse(idStr, out var id))
        {
            throw new AccesoDenegadoException("No se encontró una sesión válida.");
        }

        var nombre = principal.FindFirstValue(ClaimTypes.Name) ?? string.Empty;
        var correo = principal.FindFirstValue(ClaimTypes.Email) ?? string.Empty;
        var rol = principal.FindFirstValue(ClaimTypes.Role) ?? string.Empty;

        return new UsuarioSesionDto
        {
            Id = id,
            NombreCompleto = nombre,
            Correo = correo,
            Rol = rol
        };
    }
}
