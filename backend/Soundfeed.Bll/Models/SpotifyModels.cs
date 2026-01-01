using System.Text.Json.Serialization;

namespace Soundfeed.Bll.Models;

public sealed class SpotifyAlbum
{
    [JsonPropertyName("id")]
    public string? Id { get; init; }

    // Title
    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("label")]
    public string? Label { get; init; }

    [JsonPropertyName("release_date")]
    public string? ReleaseDate { get; init; }

    [JsonPropertyName("images")]
    public List<SpotifyImage>? Images { get; init; }

    [JsonPropertyName("artists")]
    public List<SpotifyArtist>? Artists { get; init; }

    [JsonPropertyName("external_urls")]
    public SpotifyExternalUrls? ExternalUrls { get; init; }

    [JsonPropertyName("album_type")]
    public string? AlbumType { get; init; }

    [JsonPropertyName("tracks")]
    public SpotifyPagedResponse<SpotifyTrack>? Tracks { get; init; }
}

public sealed class SpotifyArtist
{
    [JsonPropertyName("id")]
    public string? Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("images")]
    public List<SpotifyImage>? Images { get; init; }
}

public sealed class SpotifyImage
{
    [JsonPropertyName("url")]
    public string? Url { get; init; }

    [JsonPropertyName("width")]
    public int? Width { get; init; }

    [JsonPropertyName("height")]
    public int? Height { get; init; }
}

public sealed class SpotifyExternalUrls
{
    [JsonPropertyName("spotify")]
    public string? Spotify { get; init; }
}

public sealed class SpotifyTrack
{
    [JsonPropertyName("id")]
    public string? Id { get; init; }

    [JsonPropertyName("name")]
    public string? Name { get; init; }

    [JsonPropertyName("track_number")]
    public int TrackNumber { get; init; }
}
