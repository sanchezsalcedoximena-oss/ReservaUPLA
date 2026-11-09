using System.Text.Json;
using System.Threading.RateLimiting;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Microsoft.EntityFrameworkCore;
using ReservaUPLA.API.Converters;
using ReservaUPLA.API.Middleware;
using ReservaUPLA.API.Responses;
using ReservaUPLA.Application.Interfaces;
using ReservaUPLA.Application.Services;
using ReservaUPLA.Infrastructure.Data;
using ReservaUPLA.Infrastructure.Repositories;
using ReservaUPLA.Infrastructure.Security;

var builder = WebApplication.CreateBuilder(args);

var jsonOptions = new JsonSerializerOptions
{
    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
};

builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new TextoNormalizadoConverter());
        options.JsonSerializerOptions.Converters.Add(new TimeOnlyJsonConverter());
    })
    .ConfigureApiBehaviorOptions(options =>
    {
        options.InvalidModelStateResponseFactory = context =>
        {
            var errors = context.ModelState
                .Where(m => m.Value != null && m.Value.Errors.Count > 0)
                .ToDictionary(
                    kvp => kvp.Key,
                    kvp => kvp.Value!.Errors.Select(e => e.ErrorMessage).ToArray()
                );

            var response = ApiResponse<object>.Error("Error de validación en la solicitud.", errors);
            return new BadRequestObjectResult(response);
        };
    });

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddScoped<IUsuarioRepository, UsuarioRepository>();
builder.Services.AddScoped<IUsuarioService, UsuarioService>();
builder.Services.AddScoped<IAmbienteRepository, AmbienteRepository>();
builder.Services.AddScoped<IAmbienteService, AmbienteService>();
builder.Services.AddScoped<IReservaRepository, ReservaRepository>();
builder.Services.AddScoped<IReservaService, ReservaService>();
builder.Services.AddScoped<IDashboardService, DashboardService>();
builder.Services.AddScoped<IHasheadorContrasena, HasheadorContrasena>();
builder.Services.AddScoped<IAutenticacionService, AutenticacionService>();

builder.Services.AddAuthentication(CookieAuthenticationDefaults.AuthenticationScheme)
    .AddCookie(options =>
    {
        options.Cookie.Name = "reservaupla.auth";
        options.Cookie.HttpOnly = true;
        options.Cookie.SameSite = SameSiteMode.Lax;
        options.Cookie.SecurePolicy = CookieSecurePolicy.SameAsRequest;
        options.SlidingExpiration = true;
        options.ExpireTimeSpan = TimeSpan.FromHours(8);

        options.Events.OnRedirectToLogin = context =>
        {
            context.Response.StatusCode = StatusCodes.Status401Unauthorized;
            context.Response.ContentType = "application/json";
            var response = ApiResponse<object>.Error("No autenticado. Inicie sesión para continuar.");
            return context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
        };

        options.Events.OnRedirectToAccessDenied = context =>
        {
            context.Response.StatusCode = StatusCodes.Status403Forbidden;
            context.Response.ContentType = "application/json";
            var response = ApiResponse<object>.Error("Acceso denegado. No tiene permisos suficientes.");
            return context.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions));
        };
    });

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:5173")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

builder.Services.AddRateLimiter(options =>
{
    options.RejectionStatusCode = StatusCodes.Status429TooManyRequests;
    options.AddPolicy("login", httpContext =>
    {
        var ip = httpContext.Connection.RemoteIpAddress?.ToString() ?? "127.0.0.1";
        return RateLimitPartition.GetFixedWindowLimiter(
            partitionKey: ip,
            factory: _ => new FixedWindowRateLimiterOptions
            {
                PermitLimit = 5,
                Window = TimeSpan.FromMinutes(1),
                QueueLimit = 0
            });
    });

    options.OnRejected = async (context, token) =>
    {
        context.HttpContext.Response.StatusCode = StatusCodes.Status429TooManyRequests;
        context.HttpContext.Response.ContentType = "application/json";
        var response = ApiResponse<object>.Error("Demasiados intentos. Espera un minuto.");
        await context.HttpContext.Response.WriteAsync(JsonSerializer.Serialize(response, jsonOptions), token);
    };
});

var app = builder.Build();

using (var scope = app.Services.CreateScope())
{
    var usuarioRepository = scope.ServiceProvider.GetRequiredService<IUsuarioRepository>();
    var usuarioService = scope.ServiceProvider.GetRequiredService<IUsuarioService>();
    var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();

    var adminSection = app.Configuration.GetSection("AdministradorInicial");
    var nombre = adminSection["NombreCompleto"] ?? "Administrador";
    var correo = adminSection["Correo"] ?? "admin@reservaupla.local";
    var contrasena = adminSection["Contrasena"];

    if (!usuarioRepository.ExisteAdministrador())
    {
        if (!string.IsNullOrWhiteSpace(contrasena) && contrasena != "CAMBIAR")
        {
            usuarioService.CrearAdministradorInicialSiNoExiste(nombre, correo, contrasena);
            logger.LogInformation("Administrador inicial creado exitosamente con el correo '{Correo}'.", correo);
        }
        else
        {
            logger.LogWarning("No se creó el administrador inicial: la contraseña no está configurada o tiene el valor 'CAMBIAR'.");
        }
    }
}

app.UseMiddleware<ManejoErroresMiddleware>();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("AllowFrontend");

app.UseRateLimiter();

app.UseAuthentication();

app.UseAuthorization();

app.MapControllers();

app.Run();
