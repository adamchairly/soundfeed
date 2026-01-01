namespace Soundfeed.Bll.Abstractions;

public interface IReleaseSyncService
{
    /// <summary>
    /// Syncs releases for all artists in the database.
    /// </summary>
    Task SyncAllArtistsAsync(CancellationToken ct = default);

    /// <summary>
    /// Syncs releases only for artists that a specific user is subscribed to.
    /// </summary>
    Task SyncUserArtistsAsync(string userId, CancellationToken ct = default);
}