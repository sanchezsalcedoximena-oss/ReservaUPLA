using System.ComponentModel.DataAnnotations;
using ReservaUPLA.Domain.Constants;

namespace ReservaUPLA.Application.DTOs;

public class CreateAmbienteDto
{
    [Required(ErrorMessage = "El nombre es obligatorio.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "El nombre debe tener entre 3 y 100 caracteres.")]
    public string Nombre { get; set; } = string.Empty;

    [Required(ErrorMessage = "El tipo de ambiente es obligatorio.")]
    [AllowedValues(
        TipoAmbiente.LaboratorioComputo,
        TipoAmbiente.Auditorio,
        TipoAmbiente.SalaReuniones,
        TipoAmbiente.LaboratorioEspecializado,
        ErrorMessage = "El tipo de ambiente ingresado no es válido.")]
    public string Tipo { get; set; } = string.Empty;

    [Required(ErrorMessage = "La capacidad es obligatoria.")]
    [Range(1, 1000, ErrorMessage = "La capacidad debe ser un número entero entre 1 y 1000.")]
    public int Capacidad { get; set; }

    [Required(ErrorMessage = "La ubicación es obligatoria.")]
    [StringLength(100, MinimumLength = 3, ErrorMessage = "La ubicación debe tener entre 3 y 100 caracteres.")]
    public string Ubicacion { get; set; } = string.Empty;

    public Guid? ResponsableId { get; set; }
}
