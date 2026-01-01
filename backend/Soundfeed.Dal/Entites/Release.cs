namespace Soundfeed.Dal.Entites;

public class Release
{
    public int Id { get; set; }
    public int ArtistId { get; set; }

    public string SpotifyReleaseId { get; set; } = default!;
    public string SpotifyReleaseUrl { get; set; } = default!;
    public string Title { get; set; } = default!;
    public string? CoverUrl { get; set; }
    public string? Label { get; set; }
    public string ReleaseType { get; set; } = default!;


    public DateTime ReleaseDate { get; set; }
    public DateTime CreatedAt { get; set; }
    public Artist Artist { get; set; } = default!;
    public ICollection<Track> Tracks { get; set; } = new List<Track>();
}