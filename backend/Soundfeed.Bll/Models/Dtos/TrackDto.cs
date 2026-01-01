namespace Soundfeed.Bll.Models;

public class TrackDto
{
    public string Title { get; set; } = default!;
    public int TrackNumber { get; set; }
    public string SpotifyId { get; set; } = default!;
}
