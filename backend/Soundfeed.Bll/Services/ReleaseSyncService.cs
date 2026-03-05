using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Dal.Abstractions;
using Soundfeed.Dal.Entites;

namespace Soundfeed.Bll.Services;

public class ReleaseSyncService(IAppDbContext dbContext, ISpotifyService spotifyService, ILogger<ReleaseSyncService> logger) : IReleaseSyncService
{
    private readonly IAppDbContext _dbContext = dbContext;
    private readonly ISpotifyService _spotifyService = spotifyService;
    private readonly ILogger<ReleaseSyncService> _logger = logger;

    public async Task SyncAllArtistsAsync(CancellationToken ct = default)
    {
        _logger.LogInformation("Starting scheduled sync");

        var artists = await _dbContext.Artists
            .Select(a => new ValueTuple<int, string, string>(a.Id, a.SpotifyArtistId, a.Name))
            .ToListAsync(ct);

        await ProcessSyncAsync(artists, ct);

        await _dbContext.Users
        .ExecuteUpdateAsync(s => s.SetProperty(u => u.LastSyncedAt, DateTime.UtcNow), ct);
    }

    public async Task SyncUserArtistsAsync(string userId, CancellationToken ct = default)
    {
        _logger.LogInformation("Starting manual sync for user {UserId}", userId);

        var artists = await _dbContext.UserSubscriptions
            .Include(x => x.Artist)
                .Where(s => s.UserId == userId)
                .Select(a => new ValueTuple<int, string, string>(a.ArtistId, a.Artist.SpotifyArtistId, a.Artist.Name))
            .ToListAsync(ct);

        await ProcessSyncAsync(artists, ct);

        await _dbContext.Users
            .Where(u => u.Id == userId)
            .ExecuteUpdateAsync(s => s.SetProperty(u => u.LastSyncedAt, DateTime.UtcNow), ct);
    }

    private async Task ProcessSyncAsync(List<(int Id, string SpotifyArtistId, string Name)> artists, CancellationToken ct)
    {
        _logger.LogInformation("Syncing {Count} artists", artists.Count);

        foreach (var artist in artists)
        {
            if (ct.IsCancellationRequested) break;

            try
            {
                var existingIds = await _dbContext.Releases
                    .Where(r => r.ArtistId == artist.Id)
                    .Select(r => r.SpotifyReleaseId)
                    .ToHashSetAsync(ct);

                var newReleases = (await _spotifyService.GetReleasesForArtistAsync(artist.SpotifyArtistId, existingIds, ct))
                    .Select(r => new Release
                    {
                        ArtistId = artist.Id,
                        SpotifyReleaseId = r.Id,
                        Title = r.Title,
                        ReleaseDate = r.ReleaseDate,
                        CoverUrl = r.ImageUrl,
                        SpotifyReleaseUrl = r.SpotifyUrl,
                        ReleaseType = r.ReleaseType,
                        CreatedAt = DateTime.UtcNow,
                    })
                    .ToList();

                if (newReleases.Count != 0)
                {
                    _dbContext.Releases.AddRange(newReleases);

                    await _dbContext.Artists
                        .Where(a => a.Id == artist.Id)
                        .ExecuteUpdateAsync(s => s.SetProperty(a => a.LastSyncedAt, DateTime.UtcNow), ct);

                    await _dbContext.SaveChangesAsync(ct);
                    _logger.LogInformation("Synced {ArtistName}: {Count} new releases", artist.Name, newReleases.Count);
                }
                else
                {
                    _logger.LogInformation("Synced {ArtistName}: up to date", artist.Name);
                }
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to sync {ArtistName} ({SpotifyId})", artist.Name, artist.SpotifyArtistId);
            }
            finally
            {
                await Task.Delay(500, CancellationToken.None);
            }
        }
    }
}