namespace Soundfeed.Bll.Models;

public sealed class ReleaseDto
{
    public required string Id { get; init; }
    public required string Artist { get; init; }
    public required string Title { get; init; }
    public required string Label { get; init; }
    public required string ImageUrl { get; init; }
    public required string SpotifyUrl { get; init; }
    public required DateTime ReleaseDate { get; init; }
    public string ReleaseType { get; set; } = default!;
    public List<TrackDto> Tracks { get; set; } = [];
}
