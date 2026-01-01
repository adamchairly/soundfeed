namespace Soundfeed.Dal.Entites;

public class Track
{
    public int Id { get; set; }
    public int ReleaseId { get; set; }
    public string Title { get; set; } = default!;
    public int TrackNumber { get; set; }
    public string SpotifyTrackId { get; set; } = default!;

    public Release Release { get; set; } = default!;
}