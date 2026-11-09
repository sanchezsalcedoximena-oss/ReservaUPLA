using System.ComponentModel.DataAnnotations;

namespace ReservaUPLA.Application.DTOs;

public class CreateReservaDto : IValidatableObject
{
    [Required(ErrorMessage = "La fecha es obligatoria.")]
    public DateOnly Fecha { get; set; }

    [Required(ErrorMessage = "La hora de inicio es obligatoria.")]
    public TimeOnly HoraInicio { get; set; }

    [Required(ErrorMessage = "La hora de fin es obligatoria.")]
    public TimeOnly HoraFin { get; set; }

    [Required(ErrorMessage = "El motivo es obligatorio.")]
    [StringLength(500, MinimumLength = 10, ErrorMessage = "El motivo debe tener entre 10 y 500 caracteres.")]
    public string Motivo { get; set; } = string.Empty;

    [Required(ErrorMessage = "El identificador del ambiente es obligatorio.")]
    public Guid AmbienteId { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (AmbienteId == Guid.Empty)
        {
            yield return new ValidationResult("El identificador del ambiente no puede estar vacío.", [nameof(AmbienteId)]);
        }
    }
}
