using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Constants;
using ReservaUPLA.Domain.Entities;
using ReservaUPLA.Infrastructure.Data;

namespace ReservaUPLA.Infrastructure.Repositories;

public class UsuarioRepository : IUsuarioRepository
{
    private readonly AppDbContext _context;

    public UsuarioRepository(AppDbContext context)
    {
        _context = context;
    }

    public void Add(Usuario usuario)
    {
        _context.Usuarios.Add(usuario);
        _context.SaveChanges();
    }

    public bool ExisteCorreo(string correo)
    {
        return _context.Usuarios
            .Any(u => u.Correo.ToLower() == correo.ToLower());
    }

    public Usuario? ObtenerPorId(Guid id)
    {
        return _context.Usuarios
            .AsNoTracking()
            .FirstOrDefault(u => u.Id == id);
    }

    public IEnumerable<Usuario> Listar(string? rol = null)
    {
        var query = _context.Usuarios
            .AsNoTracking()
            .Where(u => u.Activo);

        if (!string.IsNullOrWhiteSpace(rol))
        {
            query = query.Where(u => u.Rol == rol);
        }

        return query.OrderBy(u => u.NombreCompleto).ToList();
    }

    public Usuario? ObtenerPorCorreo(string correo)
    {
        return _context.Usuarios
            .AsNoTracking()
            .FirstOrDefault(u => u.Correo.ToLower() == correo.ToLower());
    }

    public bool ExisteAdministrador()
    {
        return _context.Usuarios
            .Any(u => u.Rol == RolUsuario.Administrador);
    }
}
