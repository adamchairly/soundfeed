using MediatR;
using Microsoft.AspNetCore.Mvc;
using Soundfeed.Api.Extensions;
using Soundfeed.Bll.Features;
using Soundfeed.Bll.Models;

namespace Soundfeed.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ArtistsController(IMediator mediator) : ControllerBase
{
    private readonly IMediator _mediator = mediator;

    [HttpGet("{id}")]
    [ProducesResponseType(typeof(GetArtistResponse), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status404NotFound)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetArtist(int id, CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        var result = await _mediator.Send(new GetArtistQuery { Id = id }, cancellationToken);
        return Ok(result);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<GetArtistResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetArtists(CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        var result = await _mediator.Send(new GetArtistsQuery { UserId = userId }, cancellationToken);
        return Ok(result);
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(IReadOnlyList<SearchArtistResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status502BadGateway)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> SearchArtist([FromQuery] string query, [FromQuery] int offset = 0, CancellationToken cancellationToken = default)
    {
        Request.GetRequiredUserId();

        if (query.Length > 50)
            throw new ArgumentException("Search query must not exceed 50 characters.");

        if (offset > 20)
            throw new ArgumentException("Offset must not exceed 20.");

        var result = await _mediator.Send(new SearchArtistQuery { Query = query, Offset = offset }, cancellationToken);
        return Ok(result);
    }

    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status502BadGateway)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PostArtist(string artistUrl, CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        var result = await _mediator.Send(new PostArtistCommand { ArtistUrl = artistUrl, UserId = userId }, cancellationToken);
        return CreatedAtAction(nameof(GetArtist), new { id = result }, result);
    }
}
