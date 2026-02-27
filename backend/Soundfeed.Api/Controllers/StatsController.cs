using MediatR;
using Microsoft.AspNetCore.Mvc;
using Soundfeed.Api.Extensions;
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
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetStats(CancellationToken cancellationToken)
    {
        Request.GetRequiredUserId();

        var result = await _mediator.Send(new GetStatsQuery(), cancellationToken);
        return Ok(result);
    }
}
