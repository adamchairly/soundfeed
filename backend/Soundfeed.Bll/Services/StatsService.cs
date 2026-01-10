using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Distributed;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models.Dtos;
using Soundfeed.Dal.Abstractions;
using System.Text.Json;

namespace Soundfeed.Bll.Services;

public sealed class StatsService : IStatsService
{
    private readonly IAppDbContext _context;
    private readonly IDistributedCache _cache;
    private const string CacheKey = "stats";
    private static readonly TimeSpan CacheTtl = TimeSpan.FromHours(1);

    public StatsService(IAppDbContext context, IDistributedCache cache)
    {
        _context = context;
        _cache = cache;
    }

    public async Task<StatsDto> GetStatsAsync(CancellationToken cancellationToken)
    {
        var cachedStats = await _cache.GetStringAsync(CacheKey, cancellationToken);
        if (!string.IsNullOrEmpty(cachedStats))
        {
            return JsonSerializer.Deserialize<StatsDto>(cachedStats)
                ?? throw new InvalidOperationException("Failed to deserialize cached stats");
        }

        var stats = new StatsDto
        {
            Users = await _context.Users.CountAsync(cancellationToken),
            Tracks = await _context.Releases.CountAsync(cancellationToken),
            Artists = await _context.Artists.CountAsync(cancellationToken),
            UserSubscriptions = await _context.UserSubscriptions.CountAsync(cancellationToken)
        };

        var options = new DistributedCacheEntryOptions
        {
            AbsoluteExpirationRelativeToNow = CacheTtl
        };

        var serializedStats = JsonSerializer.Serialize(stats);
        await _cache.SetStringAsync(CacheKey, serializedStats, options, cancellationToken);

        return stats;
    }
}