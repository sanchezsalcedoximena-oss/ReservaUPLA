using System.ComponentModel.DataAnnotations;
using ReservaUPLA.Domain.Constants;

namespace ReservaUPLA.Application.DTOs;

public class CambiarEstadoReservaDto
{
    [Required(ErrorMessage = "El estado es obligatorio.")]
    [AllowedValues(EstadoReserva.Aprobada, EstadoReserva.Rechazada, EstadoReserva.Cancelada, ErrorMessage = "El estado ingresado no es válido. Solo se permite Aprobada, Rechazada o Cancelada.")]
    public string Estado { get; set; } = string.Empty;
}
