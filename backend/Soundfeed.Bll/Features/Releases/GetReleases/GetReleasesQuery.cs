using MediatR;

namespace Soundfeed.Bll.Models;

public sealed class GetReleasesQuery : IRequest<IReadOnlyList<GetReleaseResponse>>
{
    public required string UserId { get; init; }
}
