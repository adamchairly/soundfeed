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
    public async Task<GetArtistResponse> GetArtist(int id, CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        return await _mediator.Send(new GetArtistQuery { Id = id }, cancellationToken);
    }

    [HttpGet]
    [ProducesResponseType(typeof(IReadOnlyList<GetArtistResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]

    public async Task<IReadOnlyList<GetArtistResponse>> GetArtists(CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        return await _mediator.Send(new GetArtistsQuery { UserId = userId }, cancellationToken);
    }

    [HttpGet("search")]
    [ProducesResponseType(typeof(IReadOnlyList<SearchArtistResponse>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IReadOnlyList<SearchArtistResponse>> SearchArtist([FromQuery] string query, CancellationToken cancellationToken)
    {
        Request.GetRequiredUserId();

        return await _mediator.Send(new SearchArtistQuery { Query = query }, cancellationToken);
    }

    [HttpPost]
    [ProducesResponseType(typeof(int), StatusCodes.Status201Created)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(typeof(BaseErrorResponse), StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> PostArtist(string artistUrl, CancellationToken cancellationToken)
    {
        var userId = Request.GetRequiredUserId();

        var result = await _mediator.Send(new PostArtistCommand { ArtistUrl = artistUrl, UserId = userId }, cancellationToken);
        return CreatedAtAction(nameof(GetArtist), new { id = result }, result);
    }
}
