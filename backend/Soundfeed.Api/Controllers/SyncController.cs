using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Soundfeed.Api.Extensions;
using Soundfeed.Bll.Models;

namespace Soundfeed.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SyncController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    /// <summary>
    /// Gets the last synced time for the current user
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(DateTime?), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetLastSynced(CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();
        var result = await _mediator.Send(new GetLastSyncedQuery { UserId = userId }, cancellationToken);
        return Ok(result);
    }

    /// <summary>
    /// Manually syncs releases for the current user's artists
    /// </summary>
    [HttpPost]
    [EnableRateLimiting("sync-limit")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status502BadGateway)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SyncReleases(CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();
        await _mediator.Send(new SyncReleasesCommand { UserId = userId }, cancellationToken);
        return NoContent();
    }
}
