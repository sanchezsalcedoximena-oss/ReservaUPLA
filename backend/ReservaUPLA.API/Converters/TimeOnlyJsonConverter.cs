using System.Globalization;
using System.Text.Json;
using System.Text.Json.Serialization;

namespace ReservaUPLA.API.Converters;

public class TimeOnlyJsonConverter : JsonConverter<TimeOnly>
{
    private const string FormatoSalida = "HH:mm";
    private static readonly string[] FormatosAceptados = ["HH:mm", "HH:mm:ss", "H:mm"];

    public override TimeOnly Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var valor = reader.GetString();
        if (string.IsNullOrWhiteSpace(valor))
        {
            return default;
        }

        if (TimeOnly.TryParseExact(valor, FormatosAceptados, CultureInfo.InvariantCulture, DateTimeStyles.None, out var hora))
        {
            return hora;
        }

        if (TimeOnly.TryParse(valor, CultureInfo.InvariantCulture, out hora))
        {
            return hora;
        }

        throw new JsonException($"El valor '{valor}' no tiene un formato de hora válido (HH:mm).");
    }

    public override void Write(Utf8JsonWriter writer, TimeOnly value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value.ToString(FormatoSalida, CultureInfo.InvariantCulture));
    }
}
