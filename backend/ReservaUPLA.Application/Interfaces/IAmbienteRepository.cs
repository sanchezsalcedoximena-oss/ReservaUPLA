using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Interfaces;

public interface IAmbienteRepository
{
    void Add(Ambiente ambiente);
    bool ExisteNombre(string nombre);
    Ambiente? ObtenerPorId(Guid id);
    IEnumerable<Ambiente> Listar(bool soloDisponibles = false);
}
