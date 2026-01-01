namespace Soundfeed.Bll;

public class SpotifyOptions
{
    public const string SectionName = "Spotify";
    public required string ClientId { get; set; }
    public required string ClientSecret { get; set; }
    public string BaseUrl { get; set; } = "https://api.spotify.com/v1";
    public string TokenUrl { get; set; } = "https://accounts.spotify.com/api/token";
}