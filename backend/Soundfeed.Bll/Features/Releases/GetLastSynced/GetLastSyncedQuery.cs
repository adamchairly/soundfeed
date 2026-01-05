using MediatR;

namespace Soundfeed.Bll.Models;

public sealed class GetLastSyncedQuery : IRequest<DateTime?>
{
    public required string UserId { get; init; }
}