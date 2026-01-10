using Soundfeed.Bll.Models.Dtos;

namespace Soundfeed.Bll.Abstractions;

public interface IStatsService
{
    Task<StatsDto> GetStatsAsync(CancellationToken cancellationToken);
}
