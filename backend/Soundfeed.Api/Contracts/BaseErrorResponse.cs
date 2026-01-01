using System.Text.Json.Serialization;

namespace Soundfeed.Api;

public class BaseErrorResponse
{
    [JsonPropertyName("error")]
    public string? Error { get; init; }

    [JsonPropertyName("message")]
    public string? Message { get; init; }

    [JsonPropertyName("code")]
    public int? Code { get; init; }
}
