using System.Text.Json.Serialization;

namespace Soundfeed.Api;

internal record BaseErrorResponse
{
    [JsonPropertyName("error")]
    public required ErrorCode Error { get; init; }

    [JsonPropertyName("message")]
    public required string Message { get; init; }

    [JsonPropertyName("code")]
    public required int Code { get; init; }
}
