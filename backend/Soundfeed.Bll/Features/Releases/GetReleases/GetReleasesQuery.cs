using MediatR;

namespace Soundfeed.Bll.Models;

public sealed class GetReleasesQuery : IRequest<PageResult<GetReleaseResponse>>
{
    public required string UserId { get; init; }
    public int Page { get; init; } = 1;
    public int PageSize { get; init; } = 20;
    public bool SortDescending { get; init; } = true;
}
