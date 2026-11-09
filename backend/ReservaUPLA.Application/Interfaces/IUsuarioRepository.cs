using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Interfaces;

public interface IUsuarioRepository
{
    void Add(Usuario usuario);
    bool ExisteCorreo(string correo);
    Usuario? ObtenerPorId(Guid id);
    IEnumerable<Usuario> Listar(string? rol = null);
    Usuario? ObtenerPorCorreo(string correo);
    bool ExisteAdministrador();
}
