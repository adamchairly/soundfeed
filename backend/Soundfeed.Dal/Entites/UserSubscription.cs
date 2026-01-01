namespace Soundfeed.Dal.Entites;

public class UserSubscription
{
    public int Id { get; set; }
    public required string UserId { get; set; }
    public int ArtistId { get; set; }

    public User User { get; set; } = default!;
    public Artist Artist { get; set; } = default!;
    public DateTime CreatedAt { get; set; }
}
