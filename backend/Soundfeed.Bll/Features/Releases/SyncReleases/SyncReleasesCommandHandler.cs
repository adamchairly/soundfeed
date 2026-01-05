using MediatR;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Features;

internal sealed class SyncReleasesCommandHandler(IReleaseSyncService syncService) : IRequestHandler<SyncReleasesCommand>
{
    private readonly IReleaseSyncService _syncService = syncService;

    public async Task Handle(SyncReleasesCommand request, CancellationToken cancellationToken)
    {
        await _syncService.SyncUserArtistsAsync(request.UserId, cancellationToken);
    }
}