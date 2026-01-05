namespace Soundfeed.Dal.Entites;

public class User
{
    public required string Id { get; set; }
    public string RecoveryCode { get; set; } = null!;
    public DateTime CreatedAt { get; set; }
    public DateTime LastSeenAt { get; set; }
    public DateTime? LastSyncedAt { get; set; }

    public ICollection<UserSubscription> Subscriptions { get; set; } = new List<UserSubscription>();
    public ICollection<Release> DismissedReleases { get; set; } = new List<Release>();
}