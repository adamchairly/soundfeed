namespace Soundfeed.Bll.Models;

public sealed class GetArtistResponse
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string SpotifyId { get; set; } = string.Empty;
    public string SpotifyUrl { get; set; } = string.Empty;
    public string ImageUrl { get; set; } = string.Empty;
}
