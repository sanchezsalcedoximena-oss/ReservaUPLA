using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Interfaces;

public interface IHasheadorContrasena
{
    string Hashear(Usuario usuario, string contrasena);
    bool Verificar(Usuario usuario, string contrasenaHash, string contrasena);
    string Hashear(string contrasena);
    bool Verificar(string contrasenaHash, string contrasena);
}
