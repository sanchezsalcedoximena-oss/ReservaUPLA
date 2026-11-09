using System.Text.Json;
using System.Text.Json.Serialization;
using System.Text.RegularExpressions;

namespace ReservaUPLA.API.Converters;

public partial class TextoNormalizadoConverter : JsonConverter<string>
{
    [GeneratedRegex(@"[^\S\r\n]+")]
    private static partial Regex EspaciosHorizontalesRegex();

    public override string? Read(ref Utf8JsonReader reader, Type typeToConvert, JsonSerializerOptions options)
    {
        var valor = reader.GetString();
        if (valor == null)
        {
            return null;
        }

        return EspaciosHorizontalesRegex().Replace(valor, " ").Trim();
    }

    public override void Write(Utf8JsonWriter writer, string value, JsonSerializerOptions options)
    {
        writer.WriteStringValue(value);
    }
}
