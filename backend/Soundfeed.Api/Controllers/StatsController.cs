using MediatR;
using Microsoft.AspNetCore.Mvc;
using Soundfeed.Bll.Features;
using Soundfeed.Bll.Models;

namespace Soundfeed.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class StatsController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpGet]
    [ProducesResponseType(typeof(GetStatsResponse), StatusCodes.Status200OK)]

    public async Task<GetStatsResponse> GetStats(CancellationToken cancellationToken)
    {
        return await _mediator.Send(new GetStatsQuery(), cancellationToken);
    }
}
