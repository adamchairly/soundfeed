using MediatR;
using Microsoft.AspNetCore.Mvc;
using Soundfeed.Api.Extensions;
using Soundfeed.Bll.Models;

namespace Soundfeed.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SubscriptionController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    /// <summary>
    /// Deletes a subscription for the current user
    /// </summary>
    [HttpDelete("{artistId}")]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteSubscription(int artistId, CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        await _mediator.Send(new DeleteSubscriptionCommand { ArtistId = artistId, UserId = userId }, cancellationToken);
        return NoContent();
    }
}