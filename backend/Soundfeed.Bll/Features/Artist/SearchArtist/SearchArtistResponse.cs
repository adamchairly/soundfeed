namespace Soundfeed.Bll.Features;

public sealed class SearchArtistResponse
{
    public required string Name { get; init; }
    public string? ImageUrl { get; init; }
    public string? SpotifyUrl { get; init; }
}
