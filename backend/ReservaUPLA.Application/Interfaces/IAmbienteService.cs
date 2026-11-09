using ReservaUPLA.Application.DTOs;

namespace ReservaUPLA.Application.Interfaces;

public interface IAmbienteService
{
    AmbienteDto Crear(CreateAmbienteDto dto);
    IEnumerable<AmbienteDto> Listar(bool soloDisponibles = false);
}
