using MediatR;
using Microsoft.AspNetCore.Mvc;
using Soundfeed.Api.Extensions;
using Soundfeed.Bll.Features;

namespace Soundfeed.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class EmailController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpPatch]
    [ProducesResponseType(StatusCodes.Status204NoContent)]
    public async Task<IActionResult> UpdateEmailSettings([FromBody] UpdateEmailSettingsCommand command, CancellationToken ct)
    {
        var userId = Request.GetRequiredUserId();
        var commandWithUserId = new UpdateEmailSettingsCommand
        {
            UserId = userId,
            Email = command.Email,
            Enabled = command.Enabled
        };
        await _mediator.Send(commandWithUserId, ct);
        return NoContent();
    }
}