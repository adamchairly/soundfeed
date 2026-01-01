namespace Soundfeed.Bll.Models;

public sealed class GetReleaseResponse
{
    public int Id { get; set; }
    public string Title { get; set; } = string.Empty;
    public string ArtistName { get; set; } = string.Empty;
    public DateTime ReleaseDate { get; set; }
    public string? CoverUrl { get; set; } = string.Empty;
    public string SpotifyUrl { get; set; } = string.Empty;
    public string? Label { get; set; } = string.Empty;
    public string ReleaseType { get; set; } = string.Empty;
    public List<TrackResponse> Tracks { get; set; } = new();
}

public sealed class TrackResponse
{
    public string Title { get; set; } = string.Empty;
    public int TrackNumber { get; set; }
}
