using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Exceptions;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Constants;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Services;

public class UsuarioService : IUsuarioService
{
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IHasheadorContrasena _hasheadorContrasena;

    public UsuarioService(
        IUsuarioRepository usuarioRepository,
        IHasheadorContrasena hasheadorContrasena)
    {
        _usuarioRepository = usuarioRepository;
        _hasheadorContrasena = hasheadorContrasena;
    }

    public UsuarioDto Crear(CreateUsuarioDto dto)
    {
        var correoNormalizado = dto.Correo.Trim().ToLowerInvariant();

        if (_usuarioRepository.ExisteCorreo(correoNormalizado))
        {
            throw new ConflictoException($"Ya existe un usuario registrado con el correo '{dto.Correo}'.");
        }

        var usuario = new Usuario
        {
            Id = Guid.NewGuid(),
            NombreCompleto = dto.NombreCompleto,
            Correo = correoNormalizado,
            Rol = dto.Rol,
            Activo = true
        };

        usuario.ContrasenaHash = _hasheadorContrasena.Hashear(usuario, dto.Contrasena);

        _usuarioRepository.Add(usuario);

        return MapToDto(usuario);
    }

    public IEnumerable<UsuarioDto> Listar(string? rol = null)
    {
        var usuarios = _usuarioRepository.Listar(rol);
        return usuarios.Select(MapToDto);
    }

    public void CrearAdministradorInicialSiNoExiste(string nombre, string correo, string contrasena)
    {
        if (_usuarioRepository.ExisteAdministrador())
        {
            return;
        }

        var correoNormalizado = correo.Trim().ToLowerInvariant();
        if (_usuarioRepository.ExisteCorreo(correoNormalizado))
        {
            return;
        }

        var admin = new Usuario
        {
            Id = Guid.NewGuid(),
            NombreCompleto = nombre,
            Correo = correoNormalizado,
            Rol = RolUsuario.Administrador,
            Activo = true
        };

        admin.ContrasenaHash = _hasheadorContrasena.Hashear(admin, contrasena);

        _usuarioRepository.Add(admin);
    }

    private static UsuarioDto MapToDto(Usuario usuario)
    {
        return new UsuarioDto
        {
            Id = usuario.Id,
            NombreCompleto = usuario.NombreCompleto,
            Correo = usuario.Correo,
            Rol = usuario.Rol,
            Activo = usuario.Activo
        };
    }
}
