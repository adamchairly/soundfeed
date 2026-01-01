using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using Soundfeed.Bll.Abstractions;

namespace Soundfeed.Bll.Jobs;

[DisallowConcurrentExecution]
public class ReleaseSyncJob(IServiceProvider serviceProvider, ILogger<ReleaseSyncJob> logger) : IJob
{
    private readonly ILogger<ReleaseSyncJob> _logger = logger;
    public async Task Execute(IJobExecutionContext context)
    {
        _logger.LogInformation("Scheduled Release Sync Job starting...");

        using var scope = serviceProvider.CreateScope();
        var syncService = scope.ServiceProvider.GetRequiredService<IReleaseSyncService>();

        await syncService.SyncAllArtistsAsync(context.CancellationToken);

        _logger.LogInformation("Scheduled Release Sync Job finished.");
    }
}