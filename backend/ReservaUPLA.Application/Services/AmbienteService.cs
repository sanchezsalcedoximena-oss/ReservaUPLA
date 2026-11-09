using ReservaUPLA.Application.DTOs;
using ReservaUPLA.Application.Exceptions;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Domain.Constants;
using ReservaUPLA.Domain.Entities;

namespace ReservaUPLA.Application.Services;

public class AmbienteService : IAmbienteService
{
    private readonly IAmbienteRepository _ambienteRepository;
    private readonly IUsuarioRepository _usuarioRepository;

    public AmbienteService(IAmbienteRepository ambienteRepository, IUsuarioRepository usuarioRepository)
    {
        _ambienteRepository = ambienteRepository;
        _usuarioRepository = usuarioRepository;
    }

    public AmbienteDto Crear(CreateAmbienteDto dto)
    {
        if (_ambienteRepository.ExisteNombre(dto.Nombre))
        {
            throw new ConflictoException($"Ya existe un ambiente registrado con el nombre '{dto.Nombre}'.");
        }

        if (dto.ResponsableId.HasValue)
        {
            var responsable = _usuarioRepository.ObtenerPorId(dto.ResponsableId.Value);

            if (responsable == null)
            {
                throw new RecursoNoEncontradoException($"No se encontró el usuario con ID '{dto.ResponsableId.Value}'.");
            }

            if (!responsable.Activo)
            {
                throw new ReglaNegocioException("El usuario asignado como responsable no se encuentra activo.");
            }

            if (responsable.Rol != RolUsuario.ResponsableAmbiente)
            {
                throw new ReglaNegocioException($"El usuario asignado debe tener el rol '{RolUsuario.ResponsableAmbiente}'.");
            }
        }

        var ambiente = new Ambiente
        {
            Id = Guid.NewGuid(),
            Nombre = dto.Nombre,
            Tipo = dto.Tipo,
            Capacidad = dto.Capacidad,
            Ubicacion = dto.Ubicacion,
            Estado = EstadoAmbiente.Disponible,
            ResponsableId = dto.ResponsableId
        };

        _ambienteRepository.Add(ambiente);

        return MapToDto(ambiente);
    }

    public IEnumerable<AmbienteDto> Listar(bool soloDisponibles = false)
    {
        var ambientes = _ambienteRepository.Listar(soloDisponibles);
        return ambientes.Select(MapToDto);
    }

    private static AmbienteDto MapToDto(Ambiente ambiente)
    {
        return new AmbienteDto
        {
            Id = ambiente.Id,
            Nombre = ambiente.Nombre,
            Tipo = ambiente.Tipo,
            Capacidad = ambiente.Capacidad,
            Ubicacion = ambiente.Ubicacion,
            Estado = ambiente.Estado,
            ResponsableId = ambiente.ResponsableId
        };
    }
}
