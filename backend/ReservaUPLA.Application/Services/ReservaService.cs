using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Exceptions;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Application.Reglas;
using ReservaUPLA.Domain.Constants;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Services;

public class ReservaService : IReservaService
{
    private readonly IReservaRepository _reservaRepository;
    private readonly IUsuarioRepository _usuarioRepository;
    private readonly IAmbienteRepository _ambienteRepository;

    public ReservaService(
        IReservaRepository reservaRepository,
        IUsuarioRepository usuarioRepository,
        IAmbienteRepository ambienteRepository)
    {
        _reservaRepository = reservaRepository;
        _usuarioRepository = usuarioRepository;
        _ambienteRepository = ambienteRepository;
    }

    public ReservaDto Crear(CreateReservaDto dto, UsuarioSesionDto sesion)
    {
        // 1. El usuario solicitante existe (RecursoNoEncontrado) y está activo (ReglaNegocio).
        var usuario = _usuarioRepository.ObtenerPorId(sesion.Id);
        if (usuario == null)
        {
            throw new RecursoNoEncontradoException($"No se encontró el usuario con ID '{sesion.Id}'.");
        }

        if (!usuario.Activo)
        {
            throw new ReglaNegocioException("El usuario solicitante no se encuentra activo.");
        }

        // 2. El ambiente existe (RecursoNoEncontrado) y su Estado es Disponible (ReglaNegocio).
        var ambiente = _ambienteRepository.ObtenerPorId(dto.AmbienteId);
        if (ambiente == null)
        {
            throw new RecursoNoEncontradoException($"No se encontró el ambiente con ID '{dto.AmbienteId}'.");
        }

        if (ambiente.Estado != EstadoAmbiente.Disponible)
        {
            throw new ReglaNegocioException($"El ambiente '{ambiente.Nombre}' no se encuentra disponible.");
        }

        // 3. RN-03: HoraFin > HoraInicio (ReglaNegocio).
        if (dto.HoraFin <= dto.HoraInicio)
        {
            throw new ReglaNegocioException("La hora de fin debe ser posterior a la hora de inicio.");
        }

        // 4. RN-04: HoraInicio >= Apertura y HoraFin <= Cierre (ReglaNegocio).
        if (dto.HoraInicio < HorarioReserva.Apertura || dto.HoraFin > HorarioReserva.Cierre)
        {
            throw new ReglaNegocioException($"El horario de la reserva debe estar dentro del horario de atención permitido ({HorarioReserva.Apertura:HH\\:mm} a {HorarioReserva.Cierre:HH\\:mm}).");
        }

        // 5. La fecha no puede ser anterior a hoy (ReglaNegocio).
        var hoy = DateOnly.FromDateTime(DateTime.Today);
        if (dto.Fecha < hoy)
        {
            throw new ReglaNegocioException("La fecha de la reserva no puede ser anterior a la fecha actual.");
        }

        // 6. RF-04 y RN-01: no puede existir una reserva APROBADA del mismo ambiente y fecha cuyo rango se solape.
        if (_reservaRepository.ExisteSolapamientoAprobado(dto.AmbienteId, dto.Fecha, dto.HoraInicio, dto.HoraFin))
        {
            throw new ConflictoException("Ya existe una reserva aprobada para este ambiente en el horario seleccionado.");
        }

        // 7. Se crea con Id nuevo y Estado = Pendiente. El solicitante es SIEMPRE el usuario autenticado.
        var reserva = new Reserva
        {
            Id = Guid.NewGuid(),
            Fecha = dto.Fecha,
            HoraInicio = dto.HoraInicio,
            HoraFin = dto.HoraFin,
            Motivo = dto.Motivo,
            Estado = EstadoReserva.Pendiente,
            UsuarioId = sesion.Id,
            AmbienteId = dto.AmbienteId
        };

        _reservaRepository.Add(reserva);

        return MapToDto(reserva);
    }

    public IEnumerable<ReservaListadoDto> Listar(FiltroReservaDto? filtro, UsuarioSesionDto sesion)
    {
        return _reservaRepository.Listar(filtro, sesion);
    }

    public ReservaDetalleDto ObtenerDetalle(Guid id, UsuarioSesionDto sesion)
    {
        var reserva = _reservaRepository.ObtenerPorIdConRelaciones(id);
        if (reserva == null || !EstaDentroDelAlcance(reserva, sesion))
        {
            throw new RecursoNoEncontradoException($"No se encontró la reserva con ID '{id}'.");
        }

        return MapToDetalleDto(reserva, sesion);
    }

    public ReservaDetalleDto CambiarEstado(Guid id, CambiarEstadoReservaDto dto, UsuarioSesionDto sesion)
    {
        // 1. La reserva existe y está dentro del alcance (si no, RecursoNoEncontrado).
        var reserva = _reservaRepository.ObtenerPorIdConRelaciones(id);
        if (reserva == null || !EstaDentroDelAlcance(reserva, sesion))
        {
            throw new RecursoNoEncontradoException($"No se encontró la reserva con ID '{id}'.");
        }

        // 2. RN-06: si el estado actual es Rechazada, ReglaNegocioException "Una reserva rechazada no puede modificarse.".
        if (reserva.Estado == EstadoReserva.Rechazada)
        {
            throw new ReglaNegocioException("Una reserva rechazada no puede modificarse.");
        }

        // 3. Transiciones válidas: Pendiente→Aprobada, Rechazada o Cancelada; Aprobada→Cancelada. Cualquier otra, ReglaNegocioException.
        if (reserva.Estado == EstadoReserva.Cancelada)
        {
            throw new ReglaNegocioException("Una reserva cancelada no puede modificarse.");
        }

        bool transicionValida = (reserva.Estado, dto.Estado) switch
        {
            (EstadoReserva.Pendiente, EstadoReserva.Aprobada) => true,
            (EstadoReserva.Pendiente, EstadoReserva.Rechazada) => true,
            (EstadoReserva.Pendiente, EstadoReserva.Cancelada) => true,
            (EstadoReserva.Aprobada, EstadoReserva.Cancelada) => true,
            _ => false
        };

        if (!transicionValida)
        {
            if (reserva.Estado == dto.Estado)
            {
                throw new ReglaNegocioException($"La reserva ya se encuentra en estado '{dto.Estado}'.");
            }

            if (reserva.Estado == EstadoReserva.Aprobada && dto.Estado == EstadoReserva.Rechazada)
            {
                throw new ReglaNegocioException("Una reserva aprobada no puede ser rechazada.");
            }

            throw new ReglaNegocioException($"No se permite la transición de estado '{reserva.Estado}' a '{dto.Estado}'.");
        }

        // 4. RN-05: Aprobar o Rechazar solo el Administrador; si no, AccesoDenegadoException. Cancelar: Administrador o el solicitante dueño; si no, AccesoDenegadoException.
        if (dto.Estado == EstadoReserva.Aprobada || dto.Estado == EstadoReserva.Rechazada)
        {
            if (sesion.Rol != RolUsuario.Administrador)
            {
                throw new AccesoDenegadoException("Solo el administrador puede aprobar o rechazar reservas.");
            }
        }
        else if (dto.Estado == EstadoReserva.Cancelada)
        {
            bool puedeCancelar = sesion.Rol == RolUsuario.Administrador ||
                                 (sesion.Rol == RolUsuario.Solicitante && reserva.UsuarioId == sesion.Id);
            if (!puedeCancelar)
            {
                throw new AccesoDenegadoException("No tiene permisos para cancelar esta reserva.");
            }
        }

        // 5. Al aprobar: vuelve a verificar el solapamiento con reservas APROBADAS del mismo ambiente y fecha, excluyendo la propia reserva (RN-01); si choca, ConflictoException.
        if (dto.Estado == EstadoReserva.Aprobada)
        {
            if (_reservaRepository.ExisteSolapamientoAprobadoExcluyendo(reserva.AmbienteId, reserva.Fecha, reserva.HoraInicio, reserva.HoraFin, reserva.Id))
            {
                throw new ConflictoException("Ya existe una reserva aprobada para este ambiente en el horario seleccionado.");
            }
        }

        // 6. Guarda y devuelve ReservaDetalleDto.
        reserva.Estado = dto.Estado;
        _reservaRepository.Actualizar(reserva);

        return MapToDetalleDto(reserva, sesion);
    }

    private static bool EstaDentroDelAlcance(Reserva reserva, UsuarioSesionDto sesion)
    {
        return sesion.Rol switch
        {
            RolUsuario.Administrador => true,
            RolUsuario.Solicitante => reserva.UsuarioId == sesion.Id,
            RolUsuario.ResponsableAmbiente => reserva.Ambiente?.ResponsableId == sesion.Id,
            _ => false
        };
    }

    private static ReservaDetalleDto MapToDetalleDto(Reserva reserva, UsuarioSesionDto sesion)
    {
        bool esDuenio = reserva.UsuarioId == sesion.Id;
        var acciones = ReservaAcciones.Calcular(reserva.Estado, sesion.Rol, esDuenio);

        return new ReservaDetalleDto
        {
            Id = reserva.Id,
            Fecha = reserva.Fecha,
            HoraInicio = reserva.HoraInicio,
            HoraFin = reserva.HoraFin,
            Estado = reserva.Estado,
            AmbienteId = reserva.AmbienteId,
            AmbienteNombre = reserva.Ambiente?.Nombre ?? string.Empty,
            AmbienteTipo = reserva.Ambiente?.Tipo ?? string.Empty,
            AmbienteUbicacion = reserva.Ambiente?.Ubicacion ?? string.Empty,
            AmbienteCapacidad = reserva.Ambiente?.Capacidad ?? 0,
            UsuarioId = reserva.UsuarioId,
            SolicitanteNombre = reserva.Usuario?.NombreCompleto ?? string.Empty,
            SolicitanteCorreo = reserva.Usuario?.Correo ?? string.Empty,
            Motivo = reserva.Motivo,
            AccionesPermitidas = acciones
        };
    }

    private static ReservaDto MapToDto(Reserva reserva)
    {
        return new ReservaDto
        {
            Id = reserva.Id,
            Fecha = reserva.Fecha,
            HoraInicio = reserva.HoraInicio,
            HoraFin = reserva.HoraFin,
            Motivo = reserva.Motivo,
            Estado = reserva.Estado,
            UsuarioId = reserva.UsuarioId,
            AmbienteId = reserva.AmbienteId
        };
    }
}
