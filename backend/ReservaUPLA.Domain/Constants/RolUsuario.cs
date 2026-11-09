namespace ReservaUPLA.Domain.Constants;

public static class RolUsuario
{
    public const string Solicitante = "Solicitante";
    public const string Administrador = "Administrador";
    public const string ResponsableAmbiente = "ResponsableAmbiente";
    public const string SolicitanteOAdministrador = $"{Solicitante},{Administrador}";
}
