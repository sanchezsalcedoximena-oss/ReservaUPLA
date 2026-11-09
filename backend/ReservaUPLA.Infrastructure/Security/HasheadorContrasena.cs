using Microsoft.AspNetCore.Identity;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Infrastructure.Security;

public class HasheadorContrasena : IHasheadorContrasena
{
    private readonly PasswordHasher<Usuario> _passwordHasher = new();

    public string Hashear(Usuario usuario, string contrasena)
    {
        return _passwordHasher.HashPassword(usuario, contrasena);
    }

    public string Hashear(string contrasena)
    {
        return Hashear(new Usuario(), contrasena);
    }

    public bool Verificar(Usuario usuario, string contrasenaHash, string contrasena)
    {
        var result = _passwordHasher.VerifyHashedPassword(usuario, contrasenaHash, contrasena);
        return result == PasswordVerificationResult.Success ||
               result == PasswordVerificationResult.SuccessRehashNeeded;
    }

    public bool Verificar(string contrasenaHash, string contrasena)
    {
        return Verificar(new Usuario(), contrasenaHash, contrasena);
    }
}
