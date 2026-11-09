using System.Text.Json;
using ReservaUPLA.API.Responses;
using ReservaUPLA.Application.Exceptions;

namespace ReservaUPLA.API.Middleware;

public class ManejoErroresMiddleware
{
    private readonly RequestDelegate _next;
    private readonly ILogger<ManejoErroresMiddleware> _logger;

    public ManejoErroresMiddleware(RequestDelegate next, ILogger<ManejoErroresMiddleware> logger)
    {
        _next = next;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }

    private async Task HandleExceptionAsync(HttpContext context, Exception ex)
    {
        context.Response.ContentType = "application/json";

        int statusCode;
        string message;

        switch (ex)
        {
            case ReglaNegocioException reglaEx:
                statusCode = StatusCodes.Status400BadRequest;
                message = reglaEx.Message;
                break;

            case CredencialesInvalidasException credEx:
                statusCode = StatusCodes.Status401Unauthorized;
                message = credEx.Message;
                break;

            case AccesoDenegadoException denegadoEx:
                statusCode = StatusCodes.Status403Forbidden;
                message = denegadoEx.Message;
                break;

            case RecursoNoEncontradoException noEncontradoEx:
                statusCode = StatusCodes.Status404NotFound;
                message = noEncontradoEx.Message;
                break;

            case ConflictoException conflictoEx:
                statusCode = StatusCodes.Status409Conflict;
                message = conflictoEx.Message;
                break;

            default:
                statusCode = StatusCodes.Status500InternalServerError;
                message = "Ocurrió un error interno.";
                _logger.LogError(ex, "Error no controlado durante la ejecución de la petición.");
                break;
        }

        context.Response.StatusCode = statusCode;
        var response = ApiResponse<object>.Error(message);

        var jsonOptions = new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        await context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
    }
}
