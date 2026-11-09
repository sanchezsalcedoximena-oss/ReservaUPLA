using ReservaUPLA.Domain.Constants;

namespace ReservaUPLA.Application.Reglas;

public static class ReservaAcciones
{
    public const string Aprobar = "Aprobar";
    public const string Rechazar = "Rechazar";
    public const string Cancelar = "Cancelar";

    public static List<string> Calcular(string estado, string rol, bool esDuenio)
    {
        var acciones = new List<string>();

        if (rol == RolUsuario.ResponsableAmbiente)
        {
            return acciones;
        }

        if (rol == RolUsuario.Administrador)
        {
            if (estado == EstadoReserva.Pendiente)
            {
                acciones.Add(Aprobar);
                acciones.Add(Rechazar);
                acciones.Add(Cancelar);
            }
            else if (estado == EstadoReserva.Aprobada)
            {
                acciones.Add(Cancelar);
            }
        }
        else if (rol == RolUsuario.Solicitante && esDuenio)
        {
            if (estado == EstadoReserva.Pendiente || estado == EstadoReserva.Aprobada)
            {
                acciones.Add(Cancelar);
            }
        }

        return acciones;
    }
}
