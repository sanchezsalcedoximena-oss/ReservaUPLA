namespace ReservaUPLA.Application.Exceptions;

public class CredencialesInvalidasException : Exception
{
    public CredencialesInvalidasException(string message) : base(message)
    {
    }
}
