namespace Soundfeed.Bll.Models;

public sealed class ArtistDto
{
    public required string Name { get; init; }
    public string? ImageUrl { get; init; }
    public string? SpotifyUrl { get; init; }
}
