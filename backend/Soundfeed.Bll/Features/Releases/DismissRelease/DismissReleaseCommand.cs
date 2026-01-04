using MediatR;

namespace Soundfeed.Bll.Models;

public sealed class DismissReleaseCommand : IRequest
{
    public required int ReleaseId { get; init; }
    public required string UserId { get; init; }
}