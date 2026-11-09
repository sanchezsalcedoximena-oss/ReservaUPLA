using ReservaUPLA.Application.DTOs;

namespace ReservaUPLA.Application.Interfaces;

public interface IUsuarioService
{
    UsuarioDto Crear(CreateUsuarioDto dto);
    IEnumerable<UsuarioDto> Listar(string? rol = null);
    void CrearAdministradorInicialSiNoExiste(string nombre, string correo, string contrasena);
}
