using System.ComponentModel.DataAnnotations;
using ReservaUPLA.Domain.Constants;

namespace ReservaUPLA.Application.DTOs;

public class CreateUsuarioDto
{
    [Required(ErrorMessage = "El nombre completo es obligatorio.")]
    [StringLength(150, MinimumLength = 3, ErrorMessage = "El nombre completo debe tener entre 3 y 150 caracteres.")]
    public string NombreCompleto { get; set; } = string.Empty;

    [Required(ErrorMessage = "El correo electrónico es obligatorio.")]
    [EmailAddress(ErrorMessage = "El formato del correo electrónico no es válido.")]
    [MaxLength(150, ErrorMessage = "El correo electrónico no puede superar los 150 caracteres.")]
    public string Correo { get; set; } = string.Empty;

    [Required(ErrorMessage = "El rol es obligatorio.")]
    [AllowedValues(RolUsuario.Solicitante, RolUsuario.Administrador, RolUsuario.ResponsableAmbiente, ErrorMessage = "El rol ingresado no es válido.")]
    public string Rol { get; set; } = string.Empty;

    [Required(ErrorMessage = "La contraseña es obligatoria.")]
    [StringLength(100, MinimumLength = 8, ErrorMessage = "La contraseña debe tener entre 8 y 100 caracteres.")]
    [RegularExpression(@"^(?=.*[a-zA-Z])(?=.*\d).+$", ErrorMessage = "La contraseña debe contener al menos una letra y un número.")]
    public string Contrasena { get; set; } = string.Empty;
}
