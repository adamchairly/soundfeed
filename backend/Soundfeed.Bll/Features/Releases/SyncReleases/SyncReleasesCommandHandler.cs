using MediatR;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Features;

internal sealed class SyncReleasesCommandHandler(IServiceScopeFactory scopeFactory, ILogger<SyncReleasesCommandHandler> logger) : IRequestHandler<SyncReleasesCommand>
{
    private readonly IServiceScopeFactory _scopeFactory = scopeFactory;
    private readonly ILogger<SyncReleasesCommandHandler> _logger = logger;

    public Task Handle(SyncReleasesCommand request, CancellationToken cancellationToken)
    {
        _ = Task.Run(async () =>
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var syncService = scope.ServiceProvider.GetRequiredService<IReleaseSyncService>();
                await syncService.SyncUserArtistsAsync(request.UserId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Background sync failed for user {UserId}", request.UserId);
            }
        });

        return Task.CompletedTask;
    }
}
