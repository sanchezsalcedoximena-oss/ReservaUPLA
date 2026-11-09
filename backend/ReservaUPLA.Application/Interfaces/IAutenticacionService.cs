using ReservaUPLA.Application.DTOs;

namespace ReservaUPLA.Application.Interfaces;

public interface IAutenticacionService
{
    UsuarioSesionDto Autenticar(LoginDto dto);
    UsuarioSesionDto ObtenerSesion(Guid id);
}
