namespace Soundfeed.Dal.Entites;

public class Artist
{
    public int Id { get; set; }
    public string Name { get; set; } = default!;
    public string SpotifyArtistId { get; set; } = default!;
    public string SpotifyUrl { get; set; } = default!;
    public string SpotifyImageUrl { get; set; } = default!;
    public DateTime CreatedAt { get; set; }

    public DateTime? LastSyncedAt { get; set; }

    public ICollection<Release> Releases { get; set; } = new List<Release>();
    public ICollection<UserSubscription> Subscriptions { get; set; } = new List<UserSubscription>();
}
