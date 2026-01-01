using MediatR;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.RateLimiting;
using Soundfeed.Api.Extensions;
using Soundfeed.Api.Middlewares;
using Soundfeed.Bll.Features;
using Soundfeed.Bll.Models;

namespace Soundfeed.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController(IMediator mediator, IConfiguration config) : ControllerBase
{
    private readonly IMediator _mediator = mediator;
    private readonly IConfiguration _config = config;

    [HttpGet]
    [ProducesResponseType(typeof(GetUserResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetCurrentUser(CancellationToken ct)
    {
        var userId = Request.GetRequiredUserId();
        return Ok(await _mediator.Send(new GetUserQuery { UserId = userId }, ct));
    }

    [HttpPost]
    [EnableRateLimiting("recovery-limit")]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> Recover([FromBody] RecoverUserCommand command)
    {
        var userId = await _mediator.Send(command);

        var secret = _config["CookieSettings:SecretKey"]
                 ?? throw new Exception("Secret configuration missing");

        var signature = UserMiddleware.CalculateSignature(userId, secret);
        var signedValue = $"{userId}.{signature}";

        Response.Cookies.Append("uid", signedValue, new CookieOptions
        {
            HttpOnly = true,
            Secure = true,
            SameSite = SameSiteMode.None,
            Expires = DateTimeOffset.UtcNow.AddYears(1)
        });

        return Ok();
    }
}
