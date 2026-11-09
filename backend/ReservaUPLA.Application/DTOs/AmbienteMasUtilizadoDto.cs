namespace ReservaUPLA.Application.DTOs;

public class AmbienteMasUtilizadoDto
{
    public Guid AmbienteId { get; set; }
    public string Nombre { get; set; } = string.Empty;
    public int TotalReservas { get; set; }
}
