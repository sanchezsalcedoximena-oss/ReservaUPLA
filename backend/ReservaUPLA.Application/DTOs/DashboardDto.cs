namespace ReservaUPLA.Application.DTOs;

public class DashboardDto
{
    public int TotalReservas { get; set; }
    public int Pendientes { get; set; }
    public int Aprobadas { get; set; }
    public int Rechazadas { get; set; }
    public AmbienteMasUtilizadoDto? AmbienteMasUtilizado { get; set; }
}
