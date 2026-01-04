using MediatR;
using Microsoft.AspNetCore.Mvc;
using Soundfeed.Api.Extensions;
using Soundfeed.Bll.Models;

namespace Soundfeed.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ReleaseController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    /// <summary>
    /// Gets all the new releases for the given user
    /// </summary>
    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<GetReleaseResponse>), StatusCodes.Status200OK)]
    public async Task<IReadOnlyList<GetReleaseResponse>> GetReleases(CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        return await _mediator.Send(new GetReleasesQuery { UserId = userId });
    }

    /// <summary>
    /// Dismisses a release for the current user
    /// </summary>
    [HttpDelete("{releaseId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DismissRelease(int releaseId, CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        await _mediator.Send(new DismissReleaseCommand { ReleaseId = releaseId, UserId = userId }, cancellationToken);
        return NoContent();
    }
}
