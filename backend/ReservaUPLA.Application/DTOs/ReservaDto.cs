namespace ReservaUPLA.Application.DTOs;

public class ReservaDto
{
    public Guid Id { get; set; }
    public DateOnly Fecha { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFin { get; set; }
    public string Motivo { get; set; } = string.Empty;
    public string Estado { get; set; } = string.Empty;
    public Guid UsuarioId { get; set; }
    public Guid AmbienteId { get; set; }
}
