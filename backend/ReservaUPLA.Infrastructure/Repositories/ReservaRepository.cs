using Microsoft.EntityFrameworkCore;
using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Constants;
using ReservaUPLA.Domain.Entities;
using ReservaUPLA.Infrastructure.Data;

namespace ReservaUPLA.Infrastructure.Repositories;

public class ReservaRepository : IReservaRepository
{
    private readonly AppDbContext _context;

    public ReservaRepository(AppDbContext context)
    {
        _context = context;
    }

    public void Add(Reserva reserva)
    {
        _context.Reservas.Add(reserva);
        _context.SaveChanges();
    }

    public bool ExisteSolapamientoAprobado(Guid ambienteId, DateOnly fecha, TimeOnly horaInicio, TimeOnly horaFin)
    {
        return _context.Reservas
            .AsNoTracking()
            .Any(r => r.AmbienteId == ambienteId
                   && r.Fecha == fecha
                   && r.Estado == EstadoReserva.Aprobada
                   && r.HoraInicio < horaFin
                   && horaInicio < r.HoraFin);
    }

    public bool ExisteSolapamientoAprobadoExcluyendo(Guid ambienteId, DateOnly fecha, TimeOnly horaInicio, TimeOnly horaFin, Guid reservaIdExcluir)
    {
        return _context.Reservas
            .AsNoTracking()
            .Any(r => r.AmbienteId == ambienteId
                   && r.Fecha == fecha
                   && r.Estado == EstadoReserva.Aprobada
                   && r.Id != reservaIdExcluir
                   && r.HoraInicio < horaFin
                   && horaInicio < r.HoraFin);
    }

    public IEnumerable<ReservaListadoDto> Listar(FiltroReservaDto? filtro, UsuarioSesionDto sesion)
    {
        var query = _context.Reservas.AsNoTracking();

        query = sesion.Rol switch
        {
            RolUsuario.Administrador => query,
            RolUsuario.Solicitante => query.Where(r => r.UsuarioId == sesion.Id),
            RolUsuario.ResponsableAmbiente => query.Where(r => r.Ambiente.ResponsableId == sesion.Id),
            _ => query.Where(r => false)
        };

        if (filtro != null)
        {
            if (!string.IsNullOrWhiteSpace(filtro.Estado))
            {
                query = query.Where(r => r.Estado == filtro.Estado);
            }

            if (filtro.AmbienteId.HasValue && filtro.AmbienteId.Value != Guid.Empty)
            {
                query = query.Where(r => r.AmbienteId == filtro.AmbienteId.Value);
            }

            if (filtro.Fecha.HasValue)
            {
                query = query.Where(r => r.Fecha == filtro.Fecha.Value);
            }
        }

        return query
            .OrderByDescending(r => r.Fecha)
            .ThenByDescending(r => r.HoraInicio)
            .Select(r => new ReservaListadoDto
            {
                Id = r.Id,
                Fecha = r.Fecha,
                HoraInicio = r.HoraInicio,
                HoraFin = r.HoraFin,
                Estado = r.Estado,
                AmbienteId = r.AmbienteId,
                AmbienteNombre = r.Ambiente.Nombre,
                UsuarioId = r.UsuarioId,
                SolicitanteNombre = r.Usuario.NombreCompleto
            })
            .ToList();
    }

    public Reserva? ObtenerPorIdConRelaciones(Guid id)
    {
        return _context.Reservas
            .Include(r => r.Ambiente)
            .Include(r => r.Usuario)
            .FirstOrDefault(r => r.Id == id);
    }

    public void Actualizar(Reserva reserva)
    {
        if (_context.Entry(reserva).State == EntityState.Detached)
        {
            _context.Reservas.Update(reserva);
        }
        _context.SaveChanges();
    }

    public DashboardDto ObtenerDashboard(UsuarioSesionDto sesion)
    {
        var query = _context.Reservas.AsNoTracking();

        query = sesion.Rol switch
        {
            RolUsuario.Administrador => query,
            RolUsuario.Solicitante => query.Where(r => r.UsuarioId == sesion.Id),
            RolUsuario.ResponsableAmbiente => query.Where(r => r.Ambiente.ResponsableId == sesion.Id),
            _ => query.Where(r => false)
        };

        var totalReservas = query.Count();
        var pendientes = query.Count(r => r.Estado == EstadoReserva.Pendiente);
        var aprobadas = query.Count(r => r.Estado == EstadoReserva.Aprobada);
        var rechazadas = query.Count(r => r.Estado == EstadoReserva.Rechazada);

        var masUtilizado = query
            .Where(r => r.Estado == EstadoReserva.Aprobada)
            .GroupBy(r => new { r.AmbienteId, r.Ambiente.Nombre })
            .Select(g => new AmbienteMasUtilizadoDto
            {
                AmbienteId = g.Key.AmbienteId,
                Nombre = g.Key.Nombre,
                TotalReservas = g.Count()
            })
            .OrderByDescending(x => x.TotalReservas)
            .ThenBy(x => x.Nombre)
            .FirstOrDefault();

        return new DashboardDto
        {
            TotalReservas = totalReservas,
            Pendientes = pendientes,
            Aprobadas = aprobadas,
            Rechazadas = rechazadas,
            AmbienteMasUtilizado = masUtilizado
        };
    }
}
