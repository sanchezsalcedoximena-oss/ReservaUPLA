using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Exceptions;
using ReservaUPLA.Application.Interfaces;

namespace ReservaUPLA.Application.Services;

public class AutenticacionService : IAutenticacionService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IHasheadorContrasena _hasheadorContrasena;

    public AutenticacionService(
        IUsuarioRepository usuarioRepository,
        IHasheadorContrasena hasheadorContrasena)
    {
        _usuarioRepository = usuarioRepository;
        _hasheadorContrasena = hasheadorContrasena;
    }

    public UsuarioSesionDto Autenticar(LoginDto dto)
    {
        var correoNormalizado = dto.Correo.Trim().ToLowerInvariant();
        var usuario = _usuarioRepository.ObtenerPorCorreo(correoNormalizado);

        if (usuario == null || !usuario.Activo)
        {
            throw new CredencialesInvalidasException("Credenciales incorrectas.");
        }

        if (!_hasheadorContrasena.Verificar(usuario, usuario.ContrasenaHash, dto.Contrasena))
        {
            throw new CredencialesInvalidasException("Credenciales incorrectas.");
        }

        return new UsuarioSesionDto
        {
            Id = usuario.Id,
            NombreCompleto = usuario.NombreCompleto,
            Correo = usuario.Correo,
            Rol = usuario.Rol
        };
    }

    public UsuarioSesionDto ObtenerSesion(Guid id)
    {
        var usuario = _usuarioRepository.ObtenerPorId(id);

        if (usuario == null || !usuario.Activo)
        {
            throw new CredencialesInvalidasException("Credenciales incorrectas.");
        }

        return new UsuarioSesionDto
        {
            Id = usuario.Id,
            NombreCompleto = usuario.NombreCompleto,
            Correo = usuario.Correo,
            Rol = usuario.Rol
        };
    }
}
