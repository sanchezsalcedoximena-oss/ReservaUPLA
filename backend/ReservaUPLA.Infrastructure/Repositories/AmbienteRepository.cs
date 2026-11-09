using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Constants;
using ReservaUPLA.Domain.Entities;
using ReservaUPLA.Infrastructure.Data;

namespace ReservaUPLA.Infrastructure.Repositories;

public class AmbienteRepository : IAmbienteRepository
{
    private readonly AppDbContext _context;

    public AmbienteRepository(AppDbContext context)
    {
        _context = context;
    }

    public void Add(Ambiente ambiente)
    {
        _context.Ambientes.Add(ambiente);
        _context.SaveChanges();
    }

    public bool ExisteNombre(string nombre)
    {
        return _context.Ambientes
            .Any(a => a.Nombre.ToLower() == nombre.ToLower());
    }

    public Ambiente? ObtenerPorId(Guid id)
    {
        return _context.Ambientes
            .AsNoTracking()
            .FirstOrDefault(a => a.Id == id);
    }

    public IEnumerable<Ambiente> Listar(bool soloDisponibles = false)
    {
        var query = _context.Ambientes.AsNoTracking();

        if (soloDisponibles)
        {
            query = query.Where(a => a.Estado == EstadoAmbiente.Disponible);
        }

        return query.OrderBy(a => a.Nombre).ToList();
    }
}
