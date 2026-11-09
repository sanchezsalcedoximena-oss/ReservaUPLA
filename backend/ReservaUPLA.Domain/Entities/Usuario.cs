namespace ReservaUPLA.Domain.Entities;

public class Usuario
{
    public Guid Id { get; set; }
    public string NombreCompleto { get; set; } = string.Empty;
    public string Correo { get; set; } = string.Empty;
    public string Rol { get; set; } = string.Empty;
    public bool Activo { get; set; }
    public string ContrasenaHash { get; set; } = string.Empty;
}
