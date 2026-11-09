namespace ReservaUPLA.Application.DTOs;

public class FiltroReservaDto
{
    public string? Estado { get; set; }
    public Guid? AmbienteId { get; set; }
    public DateOnly? Fecha { get; set; }
}
