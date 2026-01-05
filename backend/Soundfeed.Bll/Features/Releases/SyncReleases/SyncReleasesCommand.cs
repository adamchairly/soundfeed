using MediatR;

namespace Soundfeed.Bll.Models;

public sealed class SyncReleasesCommand : IRequest
{
    public required string UserId { get; init; }
}