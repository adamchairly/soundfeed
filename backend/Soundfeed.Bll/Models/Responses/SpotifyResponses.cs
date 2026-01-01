using System.Text.Json.Serialization;

namespace Soundfeed.Bll.Models;

public sealed class SpotifyPagedResponse<T>
{
    [JsonPropertyName("items")]
    public List<T>? Items { get; init; }

    [JsonPropertyName("next")]
    public string? Next { get; init; }
}


public sealed class SpotifyBatchAlbumResponse
{
    [JsonPropertyName("albums")]
    public List<SpotifyAlbum>? Albums { get; init; }
}

public sealed class SpotifyArtistDetailResponse
{
    [JsonPropertyName("name")]
    public required string Name { get; init; }

    [JsonPropertyName("images")]
    public List<SpotifyImage>? Images { get; init; }
}

public sealed class SpotifyTokenResponse
{
    [JsonPropertyName("access_token")]
    public required string AccessToken { get; init; }

    [JsonPropertyName("token_type")]
    public required string TokenType { get; init; }

    [JsonPropertyName("expires_in")]
    public required int ExpiresIn { get; init; }
}

public sealed class SpotifySearchResponse
{
    [JsonPropertyName("artists")]
    public SpotifyPagedResponse<SpotifyArtist>? Artists { get; init; }
}