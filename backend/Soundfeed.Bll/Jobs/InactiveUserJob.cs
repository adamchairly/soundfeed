using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Quartz;
using Soundfeed.Bll.Abstractions;

namespace Soundfeed.Bll.Jobs;

[DisallowConcurrentExecution]
public class InactiveUserJob(IServiceProvider serviceProvider, ILogger<ReleaseSyncJob> logger) : IJob
{
    private readonly ILogger<ReleaseSyncJob> _logger = logger;
    public async Task Execute(IJobExecutionContext context)
    {
        _logger.LogInformation("Scheduled Inactive user job starting...");

        using var scope = serviceProvider.CreateScope();
        var userService = scope.ServiceProvider.GetRequiredService<IUserService>();

        await userService.DeleteInactiveAsync(context.CancellationToken);

        _logger.LogInformation("Scheduled Inactive User Job finished.");
    }
}
