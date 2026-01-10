using MediatR;
using Soundfeed.Bll.Abstractions;
using Soundfeed.Bll.Models;

namespace Soundfeed.Bll.Features;

internal sealed class GetStatsQueryHandler(IStatsService statsService) : IRequestHandler<GetStatsQuery, GetStatsResponse>
{
    private readonly IStatsService _statsService = statsService;

    public async Task<GetStatsResponse> Handle(GetStatsQuery request, CancellationToken cancellationToken)
    {
        return (await _statsService.GetStatsAsync(cancellationToken)).ToResponse();
    }
}
