namespace ReservaUPLA.Application.DTOs;

public class ReservaListadoDto
{
    public Guid Id { get; set; }
    public DateOnly Fecha { get; set; }
    public TimeOnly HoraInicio { get; set; }
    public TimeOnly HoraFin { get; set; }
    public string Estado { get; set; } = string.Empty;
    public Guid AmbienteId { get; set; }
    public string AmbienteNombre { get; set; } = string.Empty;
    public Guid UsuarioId { get; set; }
    public string SolicitanteNombre { get; set; } = string.Empty;
}
